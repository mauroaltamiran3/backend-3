# 🛒 E-commerce Backend - Proyecto Final

Este proyecto es el backend completo de un sistema de e-commerce realizado como entrega final para el curso **Programación Backend III**.

Incluye autenticación, gestión de usuarios, productos, carritos, tickets, políticas de seguridad, logging, testing automatizado, documentación Swagger y despliegue en Docker + Render.

---

## 🚀 Tecnologías Utilizadas

- **Node.js + Express** como motor principal.
- **MongoDB + Mongoose** como base de datos.
- **Passport.js** para autenticación:
  - Local (email/password)
  - Google OAuth2
  - JWT con roles (`USER`, `ADMIN`)
- **Handlebars** para renderizar vistas del cliente.
- **Winston** como sistema de logs centralizado.
- **Swagger** para documentación de APIs REST.
- **Docker** para contenerización y despliegue.
- **Render** para hosting cloud gratuito.
- **Artillery, Mocha, Chai, Supertest** para testing.

---

## 🔐 Funcionalidades

- Registro e inicio de sesión con:
  - Email y contraseña (con hash seguro)
  - Cuenta de Google
- Sistema de roles y autorización
- CRUD de usuarios, productos y carritos
- Generación de tickets de compra
- Vista personalizada para cada rol (ADMIN/USER)
- Logs detallados de cada request
- Seguridad con cookies HTTPOnly y JWT firmados
- Estrategia robusta de middlewares

---

## 🧪 Testing

El backend incluye diferentes tipos de pruebas automáticas:

- **Supertest**: pruebas de integración sobre endpoints reales.
- **Mocha + Chai**: pruebas unitarias y aserciones.
- **Artillery**: pruebas de carga y stress.

- 📦 Imagen Docker
Podés clonar o usar directamente la imagen pública desde DockerHub:

👉 docker pull tukics/ecommerce

🌐 Demo en línea (Render)
👉 https://backend-3-7sim.onrender.com/

Comandos útiles:
```bash
npm run super         # Tests con Supertest
npm run chai          # Test unitario sobre carrito
npm run artillery-flujo  # Flujo login + creación de producto + logout
