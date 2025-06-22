const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // ✅ previene el envío clásico

  const data = {
    title: form.title.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value) || 0,
    code: form.code.value,
    category: form.category.value,
    image: form.image.value.trim(),
    description: form.description.value,
  };

  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert("✅ Producto agregado");
    location.reload();
  } else {
    const error = await res.json();
    alert("❌ Error: " + error.mensaje);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const actualizarStock = async (id, operacion) => {
    const res = await fetch(`/api/products/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operacion }),
    });

    if (res.ok) location.reload();
    else alert("❌ Error al actualizar el stock");
  };

  document.querySelectorAll(".btn-stock-increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      actualizarStock(id, "incrementar");
    });
  });

  document.querySelectorAll(".btn-stock-decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      actualizarStock(id, "reducir");
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-id");
      if (confirm("¿Estás seguro de que querés eliminar el producto?")) {
        await fetch(`/api/products/${pid}`, { method: "DELETE" });
        location.reload();
      }
    });
  });
});
