const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');


const ticketControl = new TicketControl();



io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();

        console.log(siguiente);
        callback(siguiente);
    });


    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    //EL CALLBACK ES PARA NOTIFICAR CUANDO SE HAYA HECHO EL PROCESO
    client.on('atenderTicket', (data, callback) => {

        //VALIDAR QUE EN LA DATA VENGA EL ESCRITORIO
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        //LLAMAR A LA FUNCION ATENDER TICKET
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);


        callback(atenderTicket);

        // actualizar/ notificar cambios en los ULTIMOS 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });


    });




});