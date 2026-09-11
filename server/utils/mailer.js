const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const TEMPLATES_DIR = path.join(__dirname, "templates");

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const secure = (process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port) {
    console.warn("SMTP_HOST or SMTP_PORT not set — email will be skipped");
    return null;
  }

  console.debug(
    `SMTP config: host=${host} port=${port} secure=${secure} user=${user ? "yes" : "no"}`,
  );
  const auth = user && pass ? { user, pass } : undefined;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth,
    tls: {
      rejectUnauthorized: false, // Permite certificados auto-firmados de la empresa
    },
  });
};

const loadTemplate = (name) => {
  const p = path.join(TEMPLATES_DIR, name);
  try {
    return fs.readFileSync(p, "utf8");
  } catch (err) {
    console.error("Error cargando la plantilla del correo", name, err.message);
    return null;
  }
};

const render = (template, context = {}) => {
  if (!template) return "";
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    const v = context[key];
    return v === undefined || v === null ? "" : String(v);
  });
};

const send = async ({ to, subject, html }) => {
  const from = process.env.SMTP_SENDER 
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Transporter not configured — skipping send to", to);
    return;
  }

  const msg = {
    from,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log("Email sent:", info && info.messageId);
    return info;
  } catch (err) {
    console.error(
      "Error sending email to",
      to,
      "code=",
      err.code,
      "message=",
      err.message,
    );
    console.error(err && err.stack);
    // Provide a clearer hint for DNS resolution errors
    if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
      console.error(
        "DNS lookup failed for SMTP host. Verify `SMTP_HOST` and network/VPN access.",
      );
    }
    throw err;
  }
};

// Convenience functions for solicitud events
const sendSolicitudCreated = async (to, solicitud = {}) => {
  const tpl = loadTemplate("solicitud_creada.html");
  const html = render(tpl, solicitud);
  const subject = `Solicitud creada: ${solicitud.id || ""}`;
  return send({ to, subject, html });
};

const sendSolicitudApproved = async (to, solicitud = {}) => {
  const tpl = loadTemplate("solicitud_aprobada.html");
  const html = render(tpl, solicitud);
  const subject = `Solicitud aprobada: ${solicitud.id || ""}`;
  return send({ to, subject, html });
};

const sendSolicitudRejected = async (to, solicitud = {}, motivo = "") => {
  const tpl = loadTemplate("solicitud_rechazada.html");
  const ctx = { ...solicitud, motivoRechazo: motivo };
  const html = render(tpl, ctx);
  const subject = `Solicitud rechazada: ${solicitud.id || ""}`;
  return send({ to, subject, html });
};

module.exports = {
  send,
  sendSolicitudCreated,
  sendSolicitudApproved,
  sendSolicitudRejected,
};
