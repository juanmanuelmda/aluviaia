# Aluvia AI Assistant

# PROYECTO: ALUVIA AI

Crear desde cero una aplicación web SaaS profesional llamada:

ALUVIA AI

Aluvia AI será una plataforma inteligente para propietarios y pequeños administradores de alquileres temporarios.

La aplicación debe permitir administrar propiedades, huéspedes, reservas, disponibilidad, pagos, finanzas y comunicaciones.

Además, debe incorporar inteligencia artificial para analizar el negocio, detectar oportunidades y ayudar al propietario a conseguir más reservas e ingresos.

IMPORTANTE:

NO crear solamente un prototipo visual.

NO simular funcionalidades que deberían utilizar datos reales.

NO utilizar datos ficticios para representar operaciones reales una vez que el usuario haya iniciado sesión.

La aplicación debe utilizar una base de datos real y una arquitectura coherente.

---

# 1. IDENTIDAD DEL PRODUCTO

Nombre:

ALUVIA AI

Concepto:

"Tu asistente inteligente para alquileres temporarios."

Propuesta de valor:

Aluvia AI no debe ser solamente un administrador de reservas.

Debe funcionar como un asistente inteligente que ayude al propietario a:

- organizar sus propiedades;

- administrar reservas;

- controlar huéspedes;

- controlar pagos;

- administrar sus finanzas;

- conocer la ocupación;

- detectar oportunidades;

- crear publicaciones;

- preparar mensajes;

- conseguir más reservas.

Concepto central:

"Gestioná menos. Ganá más."

La aplicación debe transmitir:

- inteligencia;

- simplicidad;

- confianza;

- profesionalismo;

- modernidad;

- tecnología.

---

# 2. USUARIO OBJETIVO

El producto está dirigido principalmente a:

- propietarios de alquileres temporarios;

- personas que poseen entre 1 y 20 propiedades;

- pequeños administradores;

- personas que actualmente utilizan WhatsApp, Excel, Google Calendar y anotaciones para administrar sus alquileres.

La aplicación debe ser fácil de utilizar incluso para personas sin conocimientos tecnológicos.

---

# 3. IDIOMA Y REGIÓN

Idioma principal:

Español latinoamericano.

Adaptar la terminología principalmente al mercado argentino.

Moneda predeterminada:

Peso argentino (ARS).

Preparar la arquitectura para poder incorporar otras monedas posteriormente.

Permitir configurar zona horaria.

---

# 4. DISEÑO GENERAL

Crear una interfaz:

- moderna;

- limpia;

- elegante;

- profesional;

- intuitiva;

- tecnológica;

- minimalista.

Inspiración conceptual:

- Airbnb;

- Stripe;

- Notion;

- Linear.

NO copiar diseños de estas plataformas.

Crear una identidad visual propia para Aluvia AI.

Utilizar una estética relacionada con:

- alojamiento;

- tecnología;

- inteligencia artificial;

- confianza.

La aplicación debe ser:

MOBILE FIRST.

Debe funcionar correctamente en:

- teléfonos;

- tablets;

- computadoras.

---

# 5. IDENTIDAD VISUAL

Crear un logotipo simple y moderno para:

ALUVIA AI

Utilizar una identidad visual coherente en:

- logo;

- botones;

- tarjetas;

- iconos;

- dashboard;

- landing page.

La marca debe sentirse como una empresa tecnológica SaaS moderna.

Evitar una estética excesivamente infantil o relacionada únicamente con hoteles.

---

# 6. NAVEGACIÓN MÓVIL

En dispositivos móviles utilizar una barra de navegación inferior con:

- Panel

- Reservas

- Calendario

- Asistente IA

Las demás funciones estarán disponibles mediante un menú lateral.

El menú lateral debe contener:

- Panel

- Propiedades

- Reservas

- Calendario

- Huéspedes

- Finanzas

- Oportunidades

- Publicaciones

- Asistente IA

- Mensajes

- Configuración

IMPORTANTE:

Cuando el menú lateral esté abierto y el usuario seleccione cualquiera de las opciones:

1. ejecutar la navegación;

2. cerrar automáticamente el menú;

3. cerrar inmediatamente el overlay;

4. mostrar la nueva pantalla ocupando todo el espacio disponible.

El usuario NO debe tener que tocar nuevamente el fondo oscuro para cerrar el menú.

El botón X debe cerrar el menú.

El overlay debe cerrar el menú.

No deben quedar elementos invisibles bloqueando la interacción.

---

# 7. AUTENTICACIÓN

Crear:

## Registro

Campos:

- nombre;

- apellido;

- email;

- contraseña;

- confirmación de contraseña.

## Login

Campos:

- email;

- contraseña.

Funciones:

- recuperar contraseña;

- mantener sesión;

- cerrar sesión.

Preparar arquitectura para:

- Google OAuth.

Cada usuario debe tener sus propios datos completamente aislados.

---

# 8. DASHBOARD PRINCIPAL

Crear un dashboard profesional.

Mostrar:

## Indicadores principales

- cantidad de propiedades;

- reservas del mes;

- ocupación;

- ingresos;

- dinero cobrado;

- dinero pendiente.

## Próximas llegadas

Mostrar:

- huésped;

- propiedad;

- fecha de check-in;

- estado de la reserva;

- estado de pago.

## Próximas salidas

Mostrar:

- huésped;

- propiedad;

- fecha de check-out.

## Alertas

Detectar:

- pagos pendientes;

- reservas pendientes;

- próximas llegadas;

- próximas salidas;

- oportunidades de ingresos.

## Acciones rápidas

Botones:

- Nueva propiedad

- Nueva reserva

- Nuevo huésped

- Registrar pago

- Preguntar a Aluvia AI

---

# 9. PROPIEDADES

Crear módulo:

PROPIEDADES

Permitir:

- crear;

- editar;

- eliminar;

- activar/desactivar.

Cada propiedad debe contener:

- nombre;

- descripción;

- dirección;

- localidad;

- provincia;

- país;

- capacidad;

- cantidad de dormitorios;

- cantidad de camas;

- cantidad de baños;

- servicios;

- comodidades;

- reglas;

- horario de check-in;

- horario de check-out;

- precio base;

- precios especiales;

- información adicional.

---

# 10. FOTOGRAFÍAS

Cada propiedad debe permitir:

- subir múltiples fotografías;

- seleccionar fotografía principal;

- ordenar fotografías;

- eliminar fotografías.

Las fotografías deben almacenarse realmente.

No utilizar imágenes ficticias como si fueran fotografías del usuario.

Las fotografías reales podrán utilizarse posteriormente para generar publicaciones.

---

# 11. HUÉSPEDES

Crear módulo:

HUÉSPEDES

Guardar:

- nombre;

- apellido;

- teléfono;

- email;

- país;

- observaciones.

Mostrar historial de:

- reservas;

- pagos;

- comunicaciones.

Relacionar huéspedes con sus reservas.

---

# 12. RESERVAS

Crear módulo:

RESERVAS

Permitir crear una reserva con:

- propiedad;

- huésped;

- fecha de check-in;

- fecha de check-out;

- cantidad de huéspedes;

- precio total;

- observaciones;

- estado.

Estados:

- Consulta

- Pendiente

- Confirmada

- Check-in

- Finalizada

- Cancelada

No permitir reservas superpuestas para la misma propiedad.

Si existe conflicto:

Mostrar una advertencia clara y evitar crear la reserva.

---

# 13. PAGOS

Cada reserva debe permitir registrar múltiples pagos.

Ejemplo:

Precio total:

$100.000

Primer pago:

$30.000

Segundo pago:

$70.000

Resultado:

Total: $100.000

Cobrado: $100.000

Pendiente: $0

Cada pago debe almacenarse como una entidad real relacionada con:

- usuario;

- reserva;

- propiedad;

- huésped.

Al crear, modificar o eliminar un pago:

Finanzas debe actualizarse automáticamente.

No duplicar pagos.

---

# 14. FINANZAS

Crear módulo:

FINANZAS

Mostrar:

- ingresos;

- cobrado;

- pendiente;

- gastos;

- resultado.

Permitir filtros por:

- propiedad;

- mes;

- año;

- período personalizado.

Mostrar gráficos cuando sean útiles.

Todos los valores deben proceder de datos reales.

Los datos financieros de Finanzas deben coincidir con los pagos y reservas existentes.

---

# 15. CALENDARIO

Crear calendario visual.

Estados:

- Disponible;

- Reservado;

- Pendiente;

- Mantenimiento;

- Uso personal.

Permitir bloquear fechas.

Mostrar visualmente las reservas.

Detectar conflictos.

Cuando se cree, modifique o cancele una reserva:

Actualizar automáticamente la disponibilidad.

---

# 16. ASISTENTE ALUVIA AI

Crear:

ASISTENTE ALUVIA AI

Debe funcionar como un asistente inteligente conectado a los datos reales del usuario.

Debe poder responder preguntas como:

"¿Qué propiedades tengo?"

"¿Qué propiedades están disponibles este fin de semana?"

"¿Quién llega mañana?"

"¿Cuánto cobré este mes?"

"¿Cuánto tengo pendiente de cobrar?"

"¿Qué propiedad tiene mejor ocupación?"

"¿Qué propiedad está funcionando peor?"

"¿Qué oportunidades tengo?"

"¿Qué puedo hacer para aumentar mis ingresos?"

La IA NO debe inventar respuestas.

Si no existen datos suficientes:

"No tengo suficiente información para responder con precisión."

---

# 17. FUNCIONES ESTRUCTURADAS DE IA

Preparar funciones para que Aluvia AI pueda consultar:

- propiedades;

- disponibilidad;

- reservas;

- huéspedes;

- pagos;

- finanzas;

- ocupación;

- oportunidades;

- publicaciones;

- mensajes.

Funciones conceptuales:

obtener_propiedades()

consultar_disponibilidad()

consultar_reservas()

consultar_huespedes()

consultar_pagos()

consultar_finanzas()

analizar_ocupacion()

detectar_oportunidades()

generar_publicacion()

generar_mensaje()

La IA debe utilizar los datos reales.

---

# 18. ACCIONES DE IA

Las acciones importantes deben requerir confirmación.

Ejemplo:

Usuario:

"Cancelá la reserva de Juan."

Aluvia AI:

"Encontré la reserva de Juan del 15 al 18 de agosto. ¿Confirmás la cancelación?"

Solo ejecutar después de la confirmación.

---

# 19. OPORTUNIDADES

Crear módulo:

OPORTUNIDADES

La IA debe analizar los datos reales del negocio.

Detectar:

## Fechas vacías

Propiedades con muchas noches disponibles próximamente.

## Baja ocupación

Propiedades cuya ocupación sea inferior al promedio.

## Bajo rendimiento

Propiedades que estén generando menos ingresos.

## Consultas pendientes

Reservas en estado:

- Consulta;

- Pendiente.

## Pagos pendientes

Reservas con saldo pendiente.

---

# 20. RECOMENDACIONES PARA AUMENTAR INGRESOS

Cada oportunidad debe mostrar:

- qué detectó;

- qué datos utilizó;

- por qué puede ser una oportunidad;

- qué recomienda hacer.

Ejemplo:

"Casa Familiar tiene 8 noches disponibles durante los próximos 15 días."

"Te recomendamos promocionar esas fechas."

Mostrar acciones:

- Crear publicación;

- Crear mensaje WhatsApp;

- Ver propiedad;

- Ignorar oportunidad.

No realizar acciones automáticamente.

---

# 21. PRECIOS Y RECOMENDACIONES

La IA puede analizar precios solamente cuando existan datos suficientes.

NO inventar:

- precios;

- demanda;

- estadísticas;

- ocupación;

- ingresos.

Si no existen datos suficientes:

"Todavía no tenemos suficientes datos históricos para recomendar un precio."

---

# 22. GENERADOR DE PUBLICACIONES

Crear módulo:

PUBLICACIONES

Permitir seleccionar una propiedad.

Utilizar automáticamente:

- nombre;

- descripción;

- ubicación;

- capacidad;

- dormitorios;

- camas;

- baños;

- servicios;

- comodidades;

- precio;

- disponibilidad;

- fotografías.

---

# 23. TIPOS DE PUBLICACIONES

Generar:

## Instagram

- título;

- descripción;

- emojis;

- llamada a la acción;

- hashtags.

## Facebook

- título;

- descripción;

- características;

- precio;

- disponibilidad;

- llamada a la acción.

## WhatsApp

Mensaje breve y atractivo.

## Portal de alquiler

Descripción profesional y detallada.

---

# 24. OBJETIVOS DE LAS PUBLICACIONES

Permitir seleccionar:

- llenar fechas vacías;

- promocionar fin de semana;

- temporada;

- vacaciones;

- feriados;

- promoción especial;

- último momento.

La IA debe adaptar el contenido al objetivo.

---

# 25. FOTOGRAFÍAS EN PUBLICACIONES

Utilizar las fotografías reales cargadas en la propiedad.

NO generar imágenes artificiales en esta etapa.

NO modificar fotografías originales.

Preparar la arquitectura para una futura función de generación o edición de imágenes.

---

# 26. WHATSAPP

Implementar inicialmente una integración sencilla mediante enlace de WhatsApp.

Flujo:

1. generar mensaje;

2. mostrar mensaje;

3. permitir editar;

4. permitir copiar;

5. abrir WhatsApp con el mensaje preparado.

El usuario debe revisar el mensaje antes de enviarlo.

NO implementar todavía WhatsApp Business API.

NO enviar mensajes automáticamente.

Preparar arquitectura para una futura integración oficial.

---

# 27. MENSAJES

Crear módulo:

MENSAJES

Permitir generar mensajes mediante IA para:

- bienvenida;

- confirmación de reserva;

- recordatorio de pago;

- seña pendiente;

- check-in;

- check-out;

- agradecimiento;

- solicitud de reseña;

- seguimiento de consulta;

- promoción;

- fechas disponibles.

---

# 28. FLUJO DE CRECIMIENTO

Esta funcionalidad es fundamental.

Debe existir un flujo integrado:

OPORTUNIDAD

↓

CREAR CAMPAÑA

↓

GENERAR PUBLICACIÓN

+

GENERAR WHATSAPP

↓

REVISAR

↓

COPIAR / ABRIR WHATSAPP

El usuario no debe tener que volver a introducir manualmente los datos.

Ejemplo:

Aluvia AI detecta:

"Casa Familiar tiene 6 noches libres."

Usuario selecciona:

"APROVECHAR OPORTUNIDAD"

Aluvia genera:

Publicación para Instagram.

Publicación para Facebook.

Mensaje de WhatsApp.

Todo utilizando los datos reales de esa propiedad.

---

# 29. LANDING PAGE

Crear una landing page profesional para Aluvia AI.

Hero:

ALUVIA AI

"Tu asistente inteligente para alquileres temporarios."

CTA:

"Comenzar gratis"

Mostrar beneficios:

- Administrá tus propiedades.

- Organizá tus reservas.

- Controlá tus finanzas.

- Consultá a tu IA.

- Detectá oportunidades.

- Creá publicaciones.

- Conseguí más reservas.

Mensaje diferencial:

"Aluvia no solo administra tus alquileres. Te ayuda a conseguir más reservas."

---

# 30. PLANES

Preparar arquitectura para:

## GRATIS

Para propietarios pequeños.

## PRO

Para propietarios con varias propiedades.

## BUSINESS

Para administradores profesionales.

No implementar pagos reales todavía.

Preparar la arquitectura para incorporar suscripciones posteriormente.

---

# 31. SEGURIDAD

Implementar aislamiento completo por usuario.

Un usuario nunca debe poder acceder a datos de otro usuario.

Proteger:

- propiedades;

- fotografías;

- huéspedes;

- reservas;

- pagos;

- finanzas;

- oportunidades;

- mensajes;

- estadísticas.

Todas las consultas deben respetar el usuario autenticado.

---

# 32. MODELO DE DATOS

Crear arquitectura relacional clara.

Entidades principales:

User

Property

PropertyPhoto

Guest

Reservation

Payment

MaintenanceBlock

Message

Notification

Opportunity

Subscription

Las relaciones deben estar correctamente normalizadas.

No duplicar información.

No crear bases de datos paralelas.

---

# 33. DATOS DEMO

Crear datos demo únicamente para mostrar el funcionamiento inicial.

Ejemplo:

- 3 propiedades;

- 5 huéspedes;

- varias reservas;

- pagos;

- oportunidades.

Los datos demo deben estar claramente diferenciados y poder eliminarse.

Nunca mezclar datos demo con datos reales.

---

# 34. RESPONSIVE DESIGN

La aplicación debe funcionar correctamente en:

- Android;

- iPhone;

- tablets;

- notebooks;

- desktop.

Prioridad:

MOBILE FIRST.

Los botones deben ser fáciles de tocar.

Evitar textos demasiado pequeños.

Evitar tarjetas que obliguen a desplazamientos horizontales.

Los formularios deben ser cómodos desde un teléfono.

---

# 35. EXPERIENCIA DE USUARIO

La aplicación debe minimizar la cantidad de pasos necesarios para realizar acciones.

Ejemplo:

Nueva reserva:

Propiedad → Huésped → Fechas → Precio → Pago → Confirmar.

Registrar seña:

Reserva → Registrar pago → Importe → Confirmar.

Crear promoción:

Oportunidad → Crear campaña → Generar contenido → Revisar → WhatsApp.

---

# 36. NOTIFICACIONES

Preparar sistema de notificaciones para:

- reservas próximas;

- pagos pendientes;

- check-in;

- check-out;

- oportunidades;

- consultas pendientes.

---

# 37. REGLAS FUNDAMENTALES

NO simular funcionalidades.

NO inventar datos.

NO duplicar información.

NO duplicar bases de datos.

NO crear sistemas paralelos.

NO crear funcionalidades aisladas que no estén conectadas con los datos reales.

Reutilizar componentes y servicios siempre que sea posible.

Las acciones destructivas requieren confirmación.

La IA debe utilizar datos reales.

---

# 38. ARQUITECTURA

Si la plataforma lo permite utilizar:

- React;

- TypeScript;

- PostgreSQL;

- autenticación segura;

- almacenamiento real de fotografías;

- API de IA.

Separar claramente:

- frontend;

- base de datos;

- lógica de negocio;

- servicios;

- IA.

Priorizar:

- seguridad;

- escalabilidad;

- mantenibilidad.

---

# 39. CONTROL DE CALIDAD

Antes de considerar la aplicación terminada realizar pruebas funcionales.

## PRUEBA 1 — RESERVA

Crear una reserva.

Comprobar que:

- aparece en reservas;

- aparece en calendario;

- afecta disponibilidad;

- aparece en dashboard.

## PRUEBA 2 — SEÑA

Crear reserva por $100.000.

Registrar seña de $30.000.

Comprobar:

Total: $100.000

Cobrado: $30.000

Pendiente: $70.000

## PRUEBA 3 — PAGO COMPLETO

Registrar segundo pago de $70.000.

Comprobar:

Total: $100.000

Cobrado: $100.000

Pendiente: $0

## PRUEBA 4 — FINANZAS

Comprobar que los pagos aparecen correctamente en Finanzas.

## PRUEBA 5 — ELIMINACIÓN

Eliminar un pago.

Comprobar que Finanzas y el saldo de la reserva se actualizan.

## PRUEBA 6 — CONFLICTO

Intentar crear dos reservas superpuestas.

Debe impedirse.

## PRUEBA 7 — CALENDARIO

Crear reserva.

Comprobar disponibilidad.

Cancelar reserva.

Comprobar que las fechas vuelven a estar disponibles.

## PRUEBA 8 — IA

Preguntar:

"¿Qué propiedades tengo disponibles?"

La respuesta debe coincidir con los datos reales.

## PRUEBA 9 — OPORTUNIDADES

Comparar las oportunidades generadas con:

- calendario;

- reservas;

- disponibilidad;

- finanzas.

## PRUEBA 10 — PUBLICACIONES

Generar publicación.

Comprobar que utiliza:

- nombre;

- ubicación;

- características;

- precio;

- disponibilidad.

## PRUEBA 11 — WHATSAPP

Generar mensaje.

Comprobar que:

- puede editarse;

- puede copiarse;

- abre WhatsApp correctamente.

## PRUEBA 12 — MENÚ MÓVIL

Abrir menú.

Seleccionar:

Propiedades.

El menú debe cerrarse automáticamente.

Repetir con:

- Reservas;

- Calendario;

- Finanzas;

- Oportunidades;

- Publicaciones;

- Asistente IA;

- Mensajes.

---

# 40. PRIORIDAD DE CONSTRUCCIÓN

Construir el producto de manera integrada.

Orden recomendado:

1. Arquitectura

2. Base de datos

3. Autenticación

4. Propiedades

5. Fotografías

6. Huéspedes

7. Reservas

8. Pagos

9. Finanzas

10. Calendario

11. Dashboard

12. Asistente IA

13. Oportunidades

14. Publicaciones

15. WhatsApp

16. Mensajes

17. Notificaciones

18. Landing page

19. Planes

20. Responsive/mobile

21. Control de calidad

No crear pantallas aisladas sin conectar su lógica.

---

# 41. OBJETIVO FINAL

Aluvia AI debe convertirse en:

"El asistente inteligente para el negocio de alquiler temporario."

Debe permitir:

GESTIONAR

→ propiedades

→ huéspedes

→ reservas

→ calendario

→ pagos

→ finanzas

ENTENDER

→ ocupación

→ ingresos

→ rendimiento

→ disponibilidad

ACTUAR

→ detectar oportunidades

→ crear publicaciones

→ crear campañas

→ preparar WhatsApp

→ conseguir más reservas

La aplicación debe sentirse como un producto SaaS profesional y no como un simple CRUD.

La experiencia debe ser sencilla:

"Aluvia entiende tu negocio y te ayuda a hacerlo crecer."

Antes de generar código, analizar toda esta especificación y diseñar una arquitectura coherente.

Construir la aplicación como un sistema integrado, funcional, seguro y preparado para evolucionar.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aluviaia.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f1d4422b-c1f5-41d6-9a59-7eef905bfadf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
