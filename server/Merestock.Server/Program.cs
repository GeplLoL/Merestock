using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;
using Merestock.Server.Data;
using Merestock.Server.Services;
using Merestock.Server.Hubs;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var env = builder.Environment;

// Lisame EF Core'i ja määrame üles PostgreSQL andmebaasiühenduse
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// Seadistame JWT-põhise autentimise
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secret = configuration["JWT:Secret"]
                     ?? throw new InvalidOperationException("JWT Secret missing");
        var key = Encoding.UTF8.GetBytes(secret);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,                           // valideerime issuer’i
            ValidateAudience = true,                         // valideerime audience’i
            ValidIssuer = configuration["JWT:Issuer"],       // lubatud issuer
            ValidAudience = configuration["JWT:Audience"],   // lubatud audience
            IssuerSigningKey = new SymmetricSecurityKey(key),// allkirjastamise võti
            ClockSkew = TimeSpan.Zero                        // pole aega nihket
        };
    });

// Lisame SignalR real-time funktsionaalsuse
builder.Services.AddSignalR();

// Lubame CORS-i klientrakenduse aadressilt ja lubame küpsised
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", policy =>
    {
        policy
          .WithOrigins("http://localhost:8081",   // frontend arenduse aadress
                       "http://10.0.2.2:8081")    // Android emulator
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
    });
});

// Registreerime meie teenused DI konteineris
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MailService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<UserService>();

// Lisame kontrollerid ja JSON-serialiseerimise NewtonSoft’iga
builder.Services.AddControllers()
    .AddNewtonsoftJson();

// Lisame Swagger’i API dokumentatsiooni jaoks
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Teenime staatilisi faile wwwroot kaustast
app.UseStaticFiles();

// Tagame, et wwwroot/uploads kaust eksisteerib
var uploadsPath = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

// Teenime staatilisi faile kaustast wwwroot/uploads URL-iga /uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

if (app.Environment.IsDevelopment())
{
    // Swagger UI ainult arendusrežiimis
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Merestock API V1");
        c.RoutePrefix = "swagger";
    });
}

// Autentimine ja autoriseerimine
app.UseAuthentication();
app.UseAuthorization();

// Rakendame CORS poliitika
app.UseCors("ClientPolicy");

// Kaardistame API kontrollerid ja SignalR hubi
app.MapControllers();
app.MapHub<ChatHub>("/chathub");

// Käivitame rakenduse
app.Run();
