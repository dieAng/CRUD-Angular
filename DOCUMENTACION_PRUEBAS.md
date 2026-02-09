# Estrategia de Pruebas para Aplicación Angular (Proyecto CRUD)

Este documento define la estrategia de pruebas o "Testing Strategy" para garantizar la calidad y robustez de la aplicación CRUD desarrollada en Angular.

## 1. Tipos de Pruebas

Para asegurar una cobertura completa, aplicaremos la **Pirámide de Pruebas**, priorizando una base sólida de pruebas unitarias, seguidas de pruebas de integración y finalmente pruebas End-to-End (E2E).

### A. Pruebas Unitarias (Unit Testing)

Las pruebas más rápidas y granulares. Se enfocan en probar unidades de código aisladas (componentes, servicios, pipes) sin dependencias externas reales.

- **Objetivo:** Verificar la lógica de negocio, transformaciones de datos y estado inicial de componentes.

### B. Pruebas de Integración (Integration Testing)

Verifican cómo interactúan varias unidades entre sí. En Angular, esto suele implicar probar componentes con sus plantillas HTML y servicios simulados, o la interacción entre un componente padre e hijo.

- **Objetivo:** Verificar enlaces de datos (data bonding), eventos del DOM y comunicación asíncrona básica.

### C. Pruebas End-to-End (E2E)

Simulan el comportamiento de un usuario real navegando por la aplicación en un navegador.

- **Objetivo:** Validar flujos críticos completos (ej: crear un usuario, editar un post) y la integración con el backend real (o mockeado a alto nivel).

### D. Otras Pruebas Recomendadas

- **Pruebas de Accesibilidad:** Garantizar que la app es usable por personas con discapacidades (WCAG).
- **Pruebas de Rendimiento:** Asegurar tiempos de carga rápidos y fluidez (Core Web Vitals).

---

## 2. Implementación: Herramientas y Lenguajes

Basándonos en la configuración actual del proyecto y los estándares de la industria:

### Unitarias y de Integración

- **Framework**: **Jasmine**. Es el framework de BDD (Behavior Driven Development) por defecto en Angular.
- **Runner**: **Karma**. Ejecuta las pruebas en navegadores reales conectados.
- **Lenguaje**: TypeScript.
- **Justificación**: El proyecto ya cuenta con la configuración de `karma.conf.js` y `tsconfig.spec.json`. Cambiar a Jest sería viable pero Jasmine/Karma es nativo y robusto para este alcance.

### End-to-End (E2E)

- **Herramienta**: **Cypress**.
- **Lenguaje**: TypeScript/JavaScript.
- **Justificación**: Protractor (la herramienta antigua de Angular) está deprecada. Cypress es moderno, rápido, tiene excelente documentación y permite depurar visualmente ("time travel").

### Herramientas Auxiliares

- **Mocking**: `HttpTestingController` (nativo de Angular) para simular llamadas HTTP.
- **Rendimiento**: **Lighthouse** (Chrome DevTools).

---

## 3. Ejemplos de Casos de Prueba Representativos

### Caso 1: Servicio `UsersService` (Prueba Unitaria)

**Objetivo:** Verificar que el servicio recupera correctamente la lista de usuarios.

- **Código a probar:** `getUsers()`
- **Mock:** Se simula una respuesta HTTP con un array de 2 usuarios ficticios.
- **Entrada:** Llamada al método `getUsers()`.
- **Resultado Esperado:**
  1.  El Observable debe resolverse con el array simulado.
  2.  Se debe haber realizado una única petición `GET` a la URL correcta.

```typescript
it('debería recuperar la lista de usuarios via GET', () => {
  const dummyUsers = [
    { id: 1, name: 'Juan' },
    { id: 2, name: 'Ana' },
  ];

  service.getUsers().subscribe((users) => {
    expect(users.length).toBe(2);
    expect(users).toEqual(dummyUsers);
  });

  const req = httpMock.expectOne(`${apiUrl}/users`);
  expect(req.request.method).toBe('GET');
  req.flush(dummyUsers);
});
```

### Caso 2: Componente `PostListComponent` (Prueba de Integración)

**Objetivo:** Verificar que los posts obtenidos se renderizan correctamente en el HTML.

- **Escenario:** El servicio devuelve una lista de 3 posts.
- **Entrada:** Inicialización del componente (`ngOnInit`).
- **Resultado Esperado:**
  1.  La variable `posts` del componente debe tener 3 elementos.
  2.  En el DOM (HTML) deben aparecer 3 elementos con la clase `.post-card`.

```typescript
it('debería mostrar 3 posts en el DOM', () => {
  // Configurar mock del servicio
  mockPostService.getPosts.and.returnValue(of(dummyPosts));

  fixture.detectChanges(); // Disparar ngOnInit

  const postElements = fixture.nativeElement.querySelectorAll('.post-card');
  expect(postElements.length).toBe(3);
  expect(postElements[0].textContent).toContain(dummyPosts[0].title);
});
```

### Caso 3: Flujo de Creación de Album (E2E con Cypress)

**Objetivo:** Validar que un usuario puede navegar al formulario y crear un nuevo álbum.

- **Escenario:** Usuario entra a la home, va a albums, hace click en "Nuevo" y rellena el formulario.
- **Entrada:** Interacción simulada de teclado y ratón.
- **Resultado Esperado:**
  1.  Redirección exitosa tras el submit.
  2.  El nuevo álbum aparece en la lista.

```typescript
it('debería crear un nuevo álbum exitosamente', () => {
  cy.visit('/albums/new');
  cy.get('input[name="title"]').type('Mi Viaje a Logroño');
  cy.get('button[type="submit"]').click();

  cy.url().should('include', '/albums');
  cy.contains('Mi Viaje a Logroño').should('be.visible');
});
```

---

## 4. Estrategia de Validación por Fases

Para garantizar la calidad en todo el ciclo de vida del desarrollo (SDLC):

### Fase 1: Desarrollo Local (Local Environment)

- **Frecuencia:** Continua (mientras el desarrollador escribe código).
- **Acciones:**
  - Ejecución de pruebas unitarias afectadas (`ng test` en modo watch).
  - Verificación manual básica en el navegador.
  - Linting automático para asegurar estilo de código.

### Fase 2: Integración Continua (CI - Alpha)

- **Frecuencia:** En cada "Pull Request" o "Push" al repositorio.
- **Acciones:**
  - Ejecución automatizada de **toda** la suite de pruebas unitarias. Si una falla, el build se rechaza.
  - Pruebas de integración de componentes clave.
  - Análisis estático de seguridad (ej: `npm audit`).

### Fase 3: Pruebas de Aceptación (Staging - Beta)

- **Frecuencia:** Antes de liberar una nueva versión (Release Candidate).
- **Acciones:**
  - Despliegue en un entorno de "Staging" idéntico a producción.
  - **Ejecución de suite E2E completa (Cypress)**: Verifica flujos críticos que tocan base de datos real o mocks de alta fidelidad.
  - **Pruebas de Rendimiento**: Verificar que el Core Web Vitals (LCP, CLS) esté en verde.
  - **UAT (User Acceptance Testing)**: Validación manual por parte del Product Owner o QA.

---

**Resumen**: Esta estrategia asegura que los errores se detecten lo antes posible (Fail Fast), minimizando el coste de corrección y garantizando una experiencia de usuario final estable y pulida.
