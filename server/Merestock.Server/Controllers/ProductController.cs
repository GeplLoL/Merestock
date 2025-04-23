using Merestock.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Merestock.Server.Data;


[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _ctx;

    public ProductController(AppDbContext ctx)
    {
        _ctx = ctx;
    }



    [HttpGet]
    public async Task<IEnumerable<Product>> Get() => await _ctx.Products.ToListAsync();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product p)
    {
        _ctx.Products.Add(p);
        await _ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromServices] IWebHostEnvironment env)
    {
        var uploads = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploads, fileName);
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return Ok(new { imageUrl = url });
    }

}
