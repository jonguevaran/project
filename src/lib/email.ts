import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendSelectionNotification(packId: string) {
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { photos: true },
  });
  if (!pack) return;
  const selectedPhotos = pack.photos.filter((p) => p.selected);
  const to = [pack.clientEmail, pack.photogEmail];
  const subject = `Selección completada - Proyecto: ${pack.name}`;
  const html = `
    <h1>¡Selección finalizada!</h1>
    <p>El cliente ha completado la selección de fotos para el proyecto <b>${pack.name}</b>.</p>
    <p>Archivos seleccionados:</p>
    <ul>
      ${selectedPhotos.map((p) => `<li>${p.filename}</li>`).join('')}
    </ul>
  `;
  if (!resend) {
    console.warn('RESEND_API_KEY is missing. Email notification was skipped.');
    return;
  }

  await resend.emails.send({
    from: 'Gestor Fotos <no-reply@gestorfotos.com>',
    to,
    subject,
    html,
  });
}
