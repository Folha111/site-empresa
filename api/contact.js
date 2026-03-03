const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const SEGMENT_LABELS = {
  ferramentas: 'Ferramentas e Instrumentos',
  hidraulico: 'Componentes Hidráulicos',
  armas: 'Armas e Munições',
  agricola: 'Equipamentos Agrícolas',
  automotivo: 'Peças Automotivas',
  outro: 'Outro',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, phone, segment, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  const rows = [
    `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">Nome</td><td style="padding:6px 12px">${escapeHtml(name)}</td></tr>`,
    company ? `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">Empresa</td><td style="padding:6px 12px">${escapeHtml(company)}</td></tr>` : '',
    `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">E-mail</td><td style="padding:6px 12px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>`,
    phone ? `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">Telefone</td><td style="padding:6px 12px">${escapeHtml(phone)}</td></tr>` : '',
    segment ? `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">Segmento</td><td style="padding:6px 12px">${escapeHtml(SEGMENT_LABELS[segment] ?? segment)}</td></tr>` : '',
  ].filter(Boolean).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#76C418;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;color:#fff;font-size:20px">Nova solicitação de contato</h1>
      </div>
      <div style="border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;padding:24px 32px">
        <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
          ${rows}
        </table>
        <div style="background:#f5f5f5;border-radius:6px;padding:16px">
          <p style="margin:0 0 8px;font-weight:600;color:#555">Mensagem</p>
          <p style="margin:0;white-space:pre-wrap;color:#333">${escapeHtml(message)}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#999">
          Esta mensagem foi enviada pelo formulário de contato do site acopecasoliveira.com.br.
          Para responder, utilize o botão de resposta do seu email (Reply-To configurado para ${escapeHtml(email)}).
        </p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Site Aço Peças Oliveira <noreply@acopecasoliveira.com.br>',
      to: ['bernardosch.borba@hotmail.com'],
      replyTo: email,
      subject: `Nova solicitação – ${name}${company ? ` (${company})` : ''}`,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[contact] Resend error:', err);
    return res.status(500).json({ error: 'Erro ao enviar email. Tente novamente mais tarde.' });
  }
};
