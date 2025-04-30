using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Merestock.Server.Data;
using Merestock.Server.Models;
using Merestock.Server.DTOs;

[ApiController]
// Määrame baastee: kõik päringud algavad /api/Product
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _ctx;
    private readonly IWebHostEnvironment _env;

    // Sõltuvuste süstimine: andmebaasi kontekst ja keskkonna info
    public ProductController(AppDbContext ctx, IWebHostEnvironment env)
    {
        _ctx = ctx;
        _env = env;
    }

    // GET /api/Product
    [HttpGet]
    public async Task<IEnumerable<ProductDto>> Get()
    {
        // Laeme tooted koos kasutajaga, teisendame DTO-ks
        var list = await _ctx.Products
            .Include(p => p.User) // lisame ka p.User, et saada e-maili
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Price = p.Price,
                ImageUrl = p.ImageUrl ?? string.Empty,          // kui null, tagastame tühja stringi
                UserId = p.UserId,
                UserEmail = p.User != null ? p.User.Email : string.Empty
            })
            .ToListAsync();

        return list;
    }

    // POST /api/Product
    [HttpPost]
    [Authorize] // lubame ainult autentitud kasutajal luua
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (dto == null)
            return BadRequest("Puuduvad andmed toote loomiseks"); // kontrollime sisendit

        // Koostame uue Product-objekti DTO-st
        var product = new Product
        {
            Title = dto.Title,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            UserId = dto.UserId
        };

        _ctx.Products.Add(product);
        await _ctx.SaveChangesAsync();       // salvestame andmebaasi

        // Laeme toodega seotud kasutaja andmed vastamiseks
        await _ctx.Entry(product).Reference(x => x.User).LoadAsync();

        // Muudame uue toote DTO-ks ja tagastame 201 Created
        var result = new ProductDto(product);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    // POST /api/Product/upload-image
    [HttpPost("upload-image")]
    [ApiExplorerSettings(IgnoreApi = true)]     // peidame API-dokumentatsioonist
    [Consumes("multipart/form-data")]           // ootame faili vormi andmeina
    public async Task<IActionResult> UploadImage([FromForm(Name = "file")] IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return Ok(new { imageUrl = (string?)null }); // kui pole faili, tagastame null

        // Määrame üleslaadimiste kausta tee
        var uploadsRoot = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploadsRoot))
            Directory.CreateDirectory(uploadsRoot);      // loome kausta, kui ei eksisteeri

        // Genereerime unikaalse nime ja salvestame faili
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var path = Path.Combine(uploadsRoot, fileName);
        await using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

        // Koostame avaliku URL-i ja tagastame kliendile
        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return Ok(new { imageUrl = url });
    }
}
