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
        <h2>Tickets del ${fechaFormateada}</h2>
        <table>
          <thead>
            <tr>
              <td>Número de Ticket</td>
              <td>Subtotal</td>
              <td>Empleado</td>
              <td>Fecha</td>
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
            <td>${new Date(ticket.FechaHora).toLocaleString('es-MX', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}</td>
          </tr>
        `
      })

      html += `
          </tbody>
        </table>
        <h3>Total del día: $${totalDia.toFixed(2)}</h3>
      `;

      contenedorReporte.innerHTML = html;



    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  });

  btnCancelar.addEventListener('click', () => {
        window.api.cerrarVentanaModal();
    });
});
