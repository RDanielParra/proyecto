document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fechaReporte');
  const btnGenerar = document.getElementById('btnGenerar');
  const contenedorReporte = document.getElementById('reporte');

  btnGenerar.addEventListener('click', async () => {
    const fechaSeleccionada = fechaInput.value;

    if (!fechaSeleccionada) {
      window.api.sendNotification('Selecciona una fecha para generar el reporte');
      return;
    }

    try {
      const tickets = await window.api.obtenerTicketsPorFecha(fechaSeleccionada);

      if (!tickets || tickets.length === 0) {
        contenedorReporte.innerHTML = `<p>No hay tickets registrados para el ${fechaSeleccionada}</p>`;
        return;
      }

      // Construcción del reporte
      let totalDia = 0;
      let html = `
        <h2>Tickets del ${fechaSeleccionada}</h2>
        <table>
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
            <td>$${ticket.Subtotal.toFixed(2)}</td>
            <td>${ticket.IdEmpleado}</td>
            <td>${new Date(ticket.Fecha).toLocaleString('es-MX')}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        <h3>Total del día: $${totalDia.toFixed(2)}</h3>
      `;

      contenedorReporte.innerHTML = html;

    } catch (error) {
      console.error('Error al generar el reporte:', error);
      window.api.sendNotification('Error al generar el reporte');
    }
  });
});
