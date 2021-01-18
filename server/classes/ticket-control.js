const fs = require('fs');

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}



class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []; //va a contener todos los tickets pendientes que no han sido atendidos
        this.ultimos4 = [];

        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {

            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;

        } else {
            this.reiniciarConteo();
        }

    }

    siguiente() {

        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);


        this.grabarArchivo();

        return `Ticket ${ this.ultimo }`;

    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimos4() {
        return this.ultimos4;
    }

    atenderTicket(escritorio) { //RECIBO UN ESCRITORIO

        //VERIFICO QUE HAYAN TICKETS PENDIENTES POR ATENDER
        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }
        //EXTRAIGO EL NUMERO PARA ROMPER LA RELACION QUE TIENE JAVASCRIPT que todos los objetos son pasados por referencia
        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift(); //ELIMINO LA PRIMERA POSICION DEL ARREGLO

        //CREO UN NUEVO TICKET EL CUAL VOY A ATENDER
        let atenderTicket = new Ticket(numeroTicket, escritorio);

        //AGREGAR EL TICKET AL INICIO DEL ARREGLO
        this.ultimos4.unshift(atenderTicket);

        //VERIFICO QUE EXISTAN 4 TICKETS O NUMEROS EN ESE ARREGLO
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); // borra el último
        }

        console.log('Ultimos 4'); //MUESTRO LOS ULTIMOS 4
        console.log(this.ultimos4);

        this.grabarArchivo(); //GRABO EL ARCHIVO

        return atenderTicket; //REGRESO CUAL ES EL TICKET QUE QUIERO ATENDER

    }


    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();

    }


    grabarArchivo() {

        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }



}



module.exports = {
    TicketControl
}