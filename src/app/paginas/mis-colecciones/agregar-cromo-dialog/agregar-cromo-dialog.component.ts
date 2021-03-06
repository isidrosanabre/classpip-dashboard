import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';

// Servicios
import { ColeccionService } from '../../../servicios/index';
import { PeticionesAPIService } from '../../../servicios/index';


export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-agregar-cromo-dialog',
  templateUrl: './agregar-cromo-dialog.component.html',
  styleUrls: ['./agregar-cromo-dialog.component.scss']
})
export class AgregarCromoDialogComponent implements OnInit {

  coleccionId: number;

  // CREAR CROMO
  nombreCromo: string;
  probabilidadCromo: string;
  nivelCromo: string;
  imagenCromo: string;
  cromosAgregados: Cromo [] = [];
  // tslint:disable-next-line:ban-types
  isDisabledCromo: Boolean = true;

  nombreImagenCromo: string;
  fileCromo: File;

  // Al principio cromo no creado y imagen no cargada
  // tslint:disable-next-line:ban-types
  imagenCargadoCromo: Boolean = false;

    // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesProbabilidad: OpcionSeleccionada[] = [
      {nombre: 'Muy Baja', id: 'Muy Baja'},
      {nombre: 'Baja', id: 'Baja'},
      {nombre: 'Media', id: 'Media'},
      {nombre: 'Alta', id: 'Alta'},
      {nombre: 'Muy Alta', id: 'Muy Alta'},

    ];

   // opcionSeleccionadaProbabilidad: string;

      // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesNivel: OpcionSeleccionada[] = [
        {nombre: 'Diamante', id: 'Diamante'},
        {nombre: 'Platino', id: 'Platino'},
        {nombre: 'Oro', id: 'Oro'},
        {nombre: 'Plata', id: 'Plata'},
        {nombre: 'Bronce', id: 'Bronce'},
    ];
    opcionSeleccionadaNivel: string;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreCromo', 'probabilidadCromo', 'nivelCromo', ' '];


  constructor(  private coleccionService: ColeccionService,
                private formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<AgregarCromoDialogComponent>,
                private peticionesAPI: PeticionesAPIService,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // Recogemos los datos que le pasamos del otro componente
    this.coleccionId = this.data.coleccionId;
  }

  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarCromoColeccion() {

    console.log('Entro a asignar el cromo ' + this.nombreCromo);
    console.log('Entro a asignar el cromo a la coleccionID' + this.coleccionId);
    console.log('Probabilidad' + this.probabilidadCromo);
    console.log('Nivel' + this.opcionSeleccionadaNivel);
    console.log('Imagen' + this.nombreImagenCromo );
    this.peticionesAPI.PonCromoColeccion(
      new Cromo(this.nombreCromo, this.nombreImagenCromo , this.probabilidadCromo, this.opcionSeleccionadaNivel), this.coleccionId)
    .subscribe((res) => {
      if (res != null) {
        this.cromosAgregados.push(res);
        this.cromosAgregados = this.cromosAgregados.filter(cromo => cromo.Nombre !== '');
         // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagenCromo
        if (this.imagenCargadoCromo === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenCromo, this.fileCromo);
          this.peticionesAPI.PonImagenCromo(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        this.LimpiarCampos();
      } else {
        console.log('fallo en la asignación');
      }
    });
  }


  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarCromo(cromo: Cromo) {
    console.log('Id cromo ' + this.coleccionId);
    this.peticionesAPI.BorrarCromo(cromo.id, this.coleccionId)
    .subscribe(() => {
      this.cromosAgregados = this.cromosAgregados.filter(res => res.id !== cromo.id);
      console.log('Cromo borrado correctamente');

    });
  }


   // Activa la función ExaminarImagenCromo
   ActivarInputCromo() {
    console.log('Activar input');
    document.getElementById('inputCromo').click();
  }

  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  ExaminarImagenCromo($event) {
    this.fileCromo = $event.target.files[0];

    console.log('fichero ' + this.fileCromo.name);
    this.nombreImagenCromo = this.fileCromo.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromo);
    reader.onload = () => {
      console.log('ya Cromo');
      this.imagenCargadoCromo = true;
      this.imagenCromo = reader.result.toString();
    };
  }
  OpcionNivelSeleccionado() {
    console.log(this.opcionSeleccionadaNivel);
    // Opcion selecionada para nivel
    if (this.opcionSeleccionadaNivel === 'Diamante') {
      this.nivelCromo = 'Diamante';
      this.probabilidadCromo = 'Muy Baja';

    }
    if (this.opcionSeleccionadaNivel === 'Platino') {
      this.nivelCromo = 'Platino';
      this.probabilidadCromo = 'Baja';
    }

    if (this.opcionSeleccionadaNivel === 'Oro') {
      this.nivelCromo = 'Oro';
      this.probabilidadCromo = 'Media';
    }

    if (this.opcionSeleccionadaNivel === 'Plata') {
      this.nivelCromo = 'Plata';
      this.probabilidadCromo = 'Alta';
    }

    if (this.opcionSeleccionadaNivel === 'Bronce') {
      this.nivelCromo = 'Bronce';
      this.probabilidadCromo = 'Muy Alta';
    }
  }

  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreCromo = undefined;
      this.probabilidadCromo = undefined;
      this.nivelCromo = null;
      this.isDisabledCromo = true;
      this.imagenCargadoCromo = false;
      this.imagenCromo = undefined;
      this.nombreImagenCromo = undefined;
      this.opcionSeleccionadaNivel = null;
  }

  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  Disabled() {

  if (this.nombreCromo === undefined || this.probabilidadCromo === undefined || this.nivelCromo === undefined ||
        this.nivelCromo === '' || this.probabilidadCromo === '' || this.nivelCromo === null) {
        this.isDisabledCromo = true;
  } else {
        this.isDisabledCromo = false;
    }
  }

  // Al cerrar el dialogo retorno la lista de cromos que hay que agregar
  Cerrar() {
    this.dialogRef.close(this.cromosAgregados);
  }
}
