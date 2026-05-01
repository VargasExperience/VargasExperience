import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { dni, nombre, correo, marca, modelo, infoExtra } = data;

    // Verificar que tengamos la clave de Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("Falta la variable RESEND_API_KEY en el archivo .env");
      return NextResponse.json({ success: false, error: "Error de configuración del servidor." }, { status: 500 });
    }

    // Define aquí a qué correo quieres que te lleguen las peticiones
    const DESTINATION_EMAIL = process.env.DESTINATION_EMAIL || "tu_correo@gmail.com";

    // Enviar los datos a Resend mediante su API REST nativa
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        // IMPORTANTE: Resend requiere usar onboarding@resend.dev si no has verificado un dominio.
        from: "VARGAS EXPERIENCE <onboarding@resend.dev>",
        to: [DESTINATION_EMAIL],
        subject: `Nueva Solicitud de Coche de ${nombre}`,
        html: `
          <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f1115; color: #e2e8f0; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 12px; border: 1px solid #1e222a; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <!-- Cabecera -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px; text-transform: uppercase;">
                <span style="color: #ef4444;">Vargas</span> Experience
              </h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Nueva Solicitud de Importación</p>
            </div>
            
            <hr style="border: 0; height: 1px; background: linear-gradient(90deg, rgba(30,34,42,0) 0%, rgba(239,68,68,0.5) 50%, rgba(30,34,42,0) 100%); margin: 0 0 30px 0;">

            <!-- Datos del Cliente -->
            <div style="background-color: #161920; padding: 25px; border-radius: 8px; border: 1px solid #1e222a; margin-bottom: 20px;">
              <h2 style="color: #ffffff; font-size: 16px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #2a2f3a; padding-bottom: 10px;">👤 Datos del Cliente</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; width: 40%;"><strong>Nombre:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${nombre}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>DNI:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${dni}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; font-weight: 500;"><a href="mailto:${correo}" style="color: #ef4444; text-decoration: none;">${correo}</a></td>
                </tr>
              </table>
            </div>

            <!-- Datos del Vehículo -->
            <div style="background-color: #161920; padding: 25px; border-radius: 8px; border: 1px solid #1e222a; margin-bottom: 20px;">
              <h2 style="color: #ffffff; font-size: 16px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #2a2f3a; padding-bottom: 10px;">🏎️ Vehículo de Interés</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; width: 40%;"><strong>Marca:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 600; font-size: 16px;">${marca}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8;"><strong>Modelo:</strong></td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: 600; font-size: 16px;">${modelo}</td>
                </tr>
              </table>
            </div>

            <!-- Notas -->
            <div style="background-color: #161920; padding: 25px; border-radius: 8px; border: 1px solid #1e222a; border-left: 3px solid #ef4444;">
              <h2 style="color: #ffffff; font-size: 14px; margin-top: 0; margin-bottom: 10px;">📝 Información Adicional</h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0;">
                ${infoExtra || '<em>No se han proporcionado detalles adicionales.</em>'}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
              <p>Este mensaje ha sido generado automáticamente desde vargasexperience.com</p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Correo enviado correctamente con Resend" });
    } else {
      const errorData = await response.json();
      console.error("Error de Resend:", errorData);
      return NextResponse.json({ success: false, error: "Error al enviar el correo a través de Resend." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ success: false, error: "Error al enviar el correo." }, { status: 500 });
  }
}
