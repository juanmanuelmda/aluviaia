/**
 * Escenario de demostración de Aluvia AI.
 * Todo se genera con fechas relativas al día de hoy y se marca con is_demo = true.
 */

function iso(offsetDays: number) {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export type DemoScenario = ReturnType<typeof buildDemoScenario>;

export function buildDemoScenario() {
  const properties = [
    {
      key: "casa",
      name: "Casa Familiar Villa General Belgrano",
      description:
        "Casa amplia y luminosa para grupos y familias, a pocas cuadras del centro de Villa General Belgrano. Ideal para descansar entre sierras.",
      address: "Los Alerces 480",
      city: "Villa General Belgrano",
      province: "Córdoba",
      country: "Argentina",
      capacity: 8,
      bedrooms: 3,
      beds: 5,
      bathrooms: 2,
      amenities: [
        "pileta",
        "jardín",
        "parrilla",
        "wifi",
        "cocina equipada",
        "estacionamiento",
        "aire acondicionado",
        "calefacción",
        "TV",
      ],
      services: ["limpieza final", "ropa blanca", "check-in personalizado"],
      rules: "No se permiten fiestas. Mascotas con aviso previo. Silencio a partir de las 23 h.",
      check_in_time: "14:00",
      check_out_time: "10:00",
      base_price: 200000,
      extra_info: "Cochera para dos autos y quincho cubierto con parrilla.",
    },
    {
      key: "depto",
      name: "Departamento Centro",
      description:
        "Departamento cómodo en pleno centro de Mar del Plata, a 4 cuadras de la playa y rodeado de gastronomía.",
      address: "San Martín 2540, piso 7",
      city: "Mar del Plata",
      province: "Buenos Aires",
      country: "Argentina",
      capacity: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      amenities: ["wifi", "cocina", "balcón", "aire acondicionado", "TV", "lavarropas"],
      services: ["limpieza final", "ropa blanca"],
      rules: "Prohibido fumar dentro del departamento. Respetar el reglamento del edificio.",
      check_in_time: "15:00",
      check_out_time: "10:00",
      base_price: 120000,
      extra_info: "Edificio con ascensor y portería. Balcón con vista a la ciudad.",
    },
    {
      key: "cabana",
      name: "Cabaña del Bosque",
      description:
        "Cabaña de madera en un entorno arbolado de Tandil, pensada para desconectar con vista al bosque.",
      address: "Camino del Cerro km 3",
      city: "Tandil",
      province: "Buenos Aires",
      country: "Argentina",
      capacity: 5,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      amenities: [
        "jardín",
        "parrilla",
        "wifi",
        "estacionamiento",
        "calefacción",
        "cocina equipada",
        "vista al bosque",
      ],
      services: ["leña incluida", "limpieza final"],
      rules: "Cuidar el entorno natural. No hacer fuego fuera de la parrilla.",
      check_in_time: "14:00",
      check_out_time: "10:00",
      base_price: 150000,
      extra_info: "Senderos de trekking a 500 metros. Ideal para parejas y familias chicas.",
    },
  ] as const;

  const guests = [
    {
      key: "maria",
      first_name: "María",
      last_name: "González",
      phone: "+5493511234567",
      email: "maria.gonzalez@ejemplo.com",
      country: "Argentina",
      notes: "Viaja en familia con dos nenes. Pide check-in temprano cuando puede.",
    },
    {
      key: "carlos",
      first_name: "Carlos",
      last_name: "Fernández",
      phone: "+5492235551234",
      email: "carlos.fernandez@ejemplo.com",
      country: "Argentina",
      notes: "Huésped recurrente de temporada. Paga siempre por transferencia.",
    },
    {
      key: "laura",
      first_name: "Laura",
      last_name: "Martínez",
      phone: "+5492494445566",
      email: "laura.martinez@ejemplo.com",
      country: "Argentina",
      notes: "Viaja con su pareja. Consultó por la posibilidad de llevar mascota.",
    },
    {
      key: "javier",
      first_name: "Javier",
      last_name: "Rodríguez",
      phone: "+5491133224455",
      email: "javier.rodriguez@ejemplo.com",
      country: "Argentina",
      notes: "Grupo de amigos. Se le recordó la regla de no hacer fiestas.",
    },
    {
      key: "sofia",
      first_name: "Sofía",
      last_name: "López",
      phone: "+5493514448899",
      email: "sofia.lopez@ejemplo.com",
      country: "Argentina",
      notes: "Reserva corporativa. Necesita factura.",
    },
    {
      key: "diego",
      first_name: "Diego",
      last_name: "Ramírez",
      phone: "+59899112233",
      email: "diego.ramirez@ejemplo.com",
      country: "Uruguay",
      notes: "Cruza en ferry, llega tarde. Coordinar entrega de llaves.",
    },
  ] as const;

  const reservations = [
    // Casa Familiar: pocas reservas próximas -> genera oportunidad de fechas vacías.
    {
      key: "casa-pasada",
      property: "casa",
      guest: "maria",
      check_in: iso(-20),
      check_out: iso(-15),
      guests_count: 6,
      total_price: 1000000,
      status: "finalizada",
      notes: "Estadía completa, todo cobrado.",
    },
    {
      key: "casa-actual",
      property: "casa",
      guest: "javier",
      check_in: iso(-2),
      check_out: iso(3),
      guests_count: 8,
      total_price: 1000000,
      status: "checkin",
      notes: "Grupo alojado actualmente. Queda saldo por cobrar al finalizar.",
    },
    {
      key: "casa-futura",
      property: "casa",
      guest: "sofia",
      check_in: iso(45),
      check_out: iso(50),
      guests_count: 5,
      total_price: 1000000,
      status: "confirmada",
      notes: "Confirmada sin pagos todavía.",
    },
    // Departamento Centro: alta ocupación y distintos estados de cobro.
    {
      key: "depto-pasada",
      property: "depto",
      guest: "carlos",
      check_in: iso(-10),
      check_out: iso(-5),
      guests_count: 4,
      total_price: 600000,
      status: "finalizada",
      notes: "Quedó saldo pendiente de $200.000 al cierre.",
    },
    {
      key: "depto-proxima",
      property: "depto",
      guest: "laura",
      check_in: iso(1),
      check_out: iso(6),
      guests_count: 3,
      total_price: 600000,
      status: "confirmada",
      notes: "Pagó seña por transferencia.",
    },
    {
      key: "depto-media",
      property: "depto",
      guest: "diego",
      check_in: iso(8),
      check_out: iso(14),
      guests_count: 4,
      total_price: 720000,
      status: "confirmada",
      notes: "Llega tarde, coordinar llaves.",
    },
    {
      key: "depto-pendiente",
      property: "depto",
      guest: "sofia",
      check_in: iso(20),
      check_out: iso(26),
      guests_count: 4,
      total_price: 720000,
      status: "pendiente",
      notes: "Espera confirmación de la empresa.",
    },
    {
      key: "depto-cancelada",
      property: "depto",
      guest: "javier",
      check_in: iso(30),
      check_out: iso(36),
      guests_count: 4,
      total_price: 720000,
      status: "cancelada",
      notes: "Cancelada por el huésped, sin pagos.",
    },
    // Cabaña del Bosque
    {
      key: "cabana-pasada",
      property: "cabana",
      guest: "laura",
      check_in: iso(-30),
      check_out: iso(-27),
      guests_count: 2,
      total_price: 450000,
      status: "finalizada",
      notes: "Estadía corta, cobrada al 100%.",
    },
    {
      key: "cabana-futura",
      property: "cabana",
      guest: "maria",
      check_in: iso(12),
      check_out: iso(15),
      guests_count: 4,
      total_price: 450000,
      status: "confirmada",
      notes: "Pago total anticipado.",
    },
    {
      key: "cabana-consulta",
      property: "cabana",
      guest: "diego",
      check_in: iso(60),
      check_out: iso(64),
      guests_count: 5,
      total_price: 600000,
      status: "consulta",
      notes: "Consulta pendiente de respuesta: pregunta por disponibilidad y precio final.",
    },
  ] as const;

  const payments = [
    { reservation: "casa-pasada", amount: 400000, method: "transferencia", paid_at: iso(-35), notes: "Seña" },
    { reservation: "casa-pasada", amount: 600000, method: "efectivo", paid_at: iso(-20), notes: "Saldo al ingresar" },
    { reservation: "casa-actual", amount: 300000, method: "transferencia", paid_at: iso(-12), notes: "Seña" },
    { reservation: "depto-pasada", amount: 200000, method: "transferencia", paid_at: iso(-25), notes: "Seña" },
    { reservation: "depto-pasada", amount: 200000, method: "efectivo", paid_at: iso(-10), notes: "Segundo pago" },
    { reservation: "depto-proxima", amount: 200000, method: "transferencia", paid_at: iso(-6), notes: "Seña" },
    { reservation: "cabana-pasada", amount: 450000, method: "mercadopago", paid_at: iso(-33), notes: "Pago total" },
    { reservation: "cabana-futura", amount: 450000, method: "transferencia", paid_at: iso(-4), notes: "Pago total anticipado" },
  ] as const;

  const expenses = [
    { property: "casa", amount: 85000, category: "limpieza", description: "Limpieza profunda post estadía", spent_at: iso(-15) },
    { property: "casa", amount: 140000, category: "mantenimiento", description: "Mantenimiento de pileta y jardín", spent_at: iso(-8) },
    { property: "depto", amount: 62000, category: "servicios", description: "Expensas y luz del mes", spent_at: iso(-12) },
    { property: "depto", amount: 45000, category: "limpieza", description: "Limpieza entre huéspedes", spent_at: iso(-5) },
    { property: "cabana", amount: 98000, category: "reparaciones", description: "Reparación de calefactor a leña", spent_at: iso(-18) },
    { property: "cabana", amount: 30000, category: "publicidad", description: "Campaña de anuncios en redes", spent_at: iso(-3) },
    { property: null, amount: 55000, category: "publicidad", description: "Publicación destacada en portal de alquileres", spent_at: iso(-2) },
  ] as const;

  const blocks = [
    { property: "casa", start_date: iso(25), end_date: iso(28), reason: "mantenimiento", notes: "Pintura y service de pileta." },
    { property: "cabana", start_date: iso(40), end_date: iso(43), reason: "uso personal", notes: "Fin de semana familiar." },
    { property: "depto", start_date: iso(50), end_date: iso(52), reason: "reparación", notes: "Cambio de termotanque." },
  ] as const;

  const publications = [
    {
      property: "casa",
      platform: "instagram",
      objective: "llenar_fechas",
      content:
        "☀️ Casa Familiar en Villa General Belgrano — hasta 8 personas, pileta, parrilla y jardín.\nQuedan noches libres este mes: escapada de sierras con todo listo para disfrutar.\nDesde $200.000 la noche. Escribinos por mensaje y reservá tus fechas.\n#VillaGeneralBelgrano #Cordoba #AlquilerTemporario #Sierras #Vacaciones",
    },
    {
      property: "depto",
      platform: "facebook",
      objective: "promocion_temporada",
      content:
        "Departamento Centro en Mar del Plata, a 4 cuadras de la playa.\n• 4 huéspedes, 2 dormitorios, 1 baño\n• Wifi, aire acondicionado, lavarropas y balcón\n• Desde $120.000 la noche\nQuedan pocas fechas disponibles para las próximas semanas. Consultá disponibilidad por mensaje privado.",
    },
    {
      property: "cabana",
      platform: "whatsapp",
      objective: "reactivar_consultas",
      content:
        "¡Hola! Te comparto la Cabaña del Bosque en Tandil 🌲\nPara 5 personas, con parrilla, jardín y calefacción. Vista directa al bosque.\n$150.000 la noche. Tengo fechas libres el mes que viene, ¿te reservo alguna?",
    },
    {
      property: "casa",
      platform: "portal",
      objective: "descripcion_portal",
      content:
        "Casa amplia y luminosa en Villa General Belgrano, con capacidad para 8 huéspedes en 3 dormitorios y 5 camas. Cuenta con pileta, jardín parquizado, quincho con parrilla, cocina equipada, aire acondicionado, calefacción y estacionamiento para dos vehículos. Ubicada a pocas cuadras del centro, es ideal para familias y grupos que buscan descanso en las sierras de Córdoba.",
    },
  ] as const;

  const messages = [
    {
      kind: "confirmación de reserva",
      channel: "whatsapp",
      guest: "laura",
      reservation: "depto-proxima",
      property: "depto",
      content:
        "¡Hola Laura! Te confirmo tu reserva en Departamento Centro del " +
        iso(1) +
        " al " +
        iso(6) +
        ". Recibimos la seña de $200.000. El check-in es a partir de las 15 h. ¡Nos vemos pronto!",
    },
    {
      kind: "recordatorio de pago",
      channel: "whatsapp",
      guest: "carlos",
      reservation: "depto-pasada",
      property: "depto",
      content:
        "Hola Carlos, ¿cómo estás? Te recuerdo que quedó un saldo pendiente de $200.000 por tu estadía en Departamento Centro. Cuando puedas, avisame y te paso los datos para la transferencia. ¡Gracias!",
    },
    {
      kind: "check-in",
      channel: "whatsapp",
      guest: "javier",
      reservation: "casa-actual",
      property: "casa",
      content:
        "¡Bienvenido Javier! La casa está lista. Dirección: Los Alerces 480, Villa General Belgrano. Check-in desde las 14 h. Cualquier cosa que necesiten, escribime por acá.",
    },
    {
      kind: "check-out",
      channel: "whatsapp",
      guest: "maria",
      reservation: "casa-pasada",
      property: "casa",
      content:
        "Hola María, gracias por elegirnos. El check-out es a las 10 h, dejá las llaves sobre la mesa del living. ¡Fue un placer recibirlos!",
    },
    {
      kind: "seguimiento de consulta",
      channel: "whatsapp",
      guest: "diego",
      reservation: "cabana-consulta",
      property: "cabana",
      content:
        "Hola Diego, te confirmo que la Cabaña del Bosque está disponible en las fechas que consultaste. El total serían $600.000 por 4 noches. Con una seña del 30% te dejo las fechas bloqueadas.",
    },
  ] as const;

  const notifications = [
    { kind: "checkin", title: "Tenés un check-in próximamente", body: "Laura Martínez llega en los próximos días a Departamento Centro." },
    { kind: "pago", title: "Hay un pago pendiente", body: "Quedan $200.000 sin cobrar de la estadía de Carlos Fernández." },
    { kind: "oportunidad", title: "Detectamos una oportunidad", body: "Casa Familiar Villa General Belgrano tiene varias noches libres próximamente." },
    { kind: "consulta", title: "Tenés una consulta pendiente", body: "Diego Ramírez consultó por la Cabaña del Bosque y todavía no fue respondida." },
  ] as const;

  return { properties, guests, reservations, payments, expenses, blocks, publications, messages, notifications };
}
