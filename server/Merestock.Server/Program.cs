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

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var env = builder.Environment;


// 1. ��������� DbContext ��� PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// 2. ������������ �������������� JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secret = configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT Secret missing");
        var key = Encoding.UTF8.GetBytes(secret);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = configuration["JWT:Issuer"],
            ValidAudience = configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });

// 3. ��������� SignalR ��� ��������� �������
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", policy =>
    {
        policy
          .WithOrigins("http://localhost:8081",   // ���� ���������� Expo �� ���� �����
                       "http://10.0.2.2:8081")    // Android AVD
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
    });
});

// 4. ������������ ����������� �������
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MailService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<UserService>();

// 5. ��������� ����������� � ������������� JSON
builder.Services.AddControllers()
    .AddNewtonsoftJson();

// 6. Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();




// 7. ����������� ����� �� wwwroot � uploads
app.UseStaticFiles(); // �� ��������� wwwroot

// ���� � ��� ���� ����� wwwroot/uploads ��� ��������:
var uploadsPath = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// 8. �������� Swagger UI ������ � ����������
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Merestock API V1");
        c.RoutePrefix = "swagger";  // /swagger/index.html
    });
}

// 9. �������� �������������� � �����������
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("ClientPolicy");

// 10. ������������� API � Hub
app.MapControllers();
app.MapHub<ChatHub>("/chathub");

// 11. ������
app.Run();
