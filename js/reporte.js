document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fechaReporte');
  const btnGenerar = document.getElementById('btnGenerar');
  const contenedorReporte = document.getElementById('reporte');
  const btnCancelar = document.getElementById('btnCancelar');

  btnGenerar.addEventListener('click', async () => {
    const fechaSeleccionada = fechaInput.value
    const fechaFormateada = new Date(fechaSeleccionada).toISOString().split('T')[0];
    
    console.log(fechaFormateada)
    if (!fechaFormateada) {
      window.api.sendNotification('Selecciona una fecha para generar el reporte');
      return;
    }

    try {
      const tickets = await window.api.obtenerTicketsPorFecha(fechaFormateada);
      console.log(tickets)
      const empleadosInfo = await window.api.getEmpleados();
      if (!tickets || tickets.length === 0) {
        contenedorReporte.innerHTML = `<p>No hay tickets registrados para el ${fechaFormateada}</p>`;
        return;
      }

      // Construcción del reporte
      let totalDia = 0;
      let html = `
        <h2 class="titulo-reporte">Tickets del ${fechaFormateada}</h2>
        <table class="reporte-tabla">
          <thead>
            <tr>
              <th>Número de Ticket</th>
              <th>Subtotal</th>
              <th>Empleado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
      `;

      tickets.forEach(ticket => {
        totalDia += parseFloat(ticket.Subtotal);
        html += `
          <tr>
            <td>${ticket.NumeroTicket}</td>
            <td>$${ticket.Subtotal}</td>
            <td>${empleadosInfo[ticket.IdEmpleado - 1].Nombre}</td>
            <td>${new Date(ticket.FechaHora).toLocaleDateString('es-MX')}</td>
          </tr>
        `
      })

      html += `
          </tbody>
        </table>
        <p class="total-reporte">Total del día: <span>$${totalDia.toFixed(2)}</span></p>
      `;

      contenedorReporte.innerHTML = html;
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
    contenedorReporte.innerHTML = html;

// Pregunta si imprimir
const deseaImprimir = await window.api.solicitarImpresion();

if (deseaImprimir) {
    console.log("Imprimiendo reporte...");
}
  });


  btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });
});

const btnImprimir = document.getElementById('btnImprimir');

btnImprimir?.addEventListener('click', async () => {
    const respuesta = await window.api.solicitarImpresion();

    if (respuesta) {
        console.log("Impresión solicitada");
    } else {
        console.log("El usuario decidió no imprimir.");
    }
});