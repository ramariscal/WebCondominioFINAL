import { Component } from '@angular/core';
import { GestionService } from 'src/app/Services/Administracion/gestion.service';
import { ApiService } from 'src/app/Services/api.service';
import { Cargo, Comuna, Empleado, Region } from 'src/app/models/empleado.model';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';


interface patente {
  patente: string;
}

@Component({
  selector: 'app-informes',
  templateUrl: 'informes.page.html',
  styleUrls: ['informes.page.scss'],
})

export class InformesPage {
  rut: string = '';
  patenteValue: string = '';
  id_est: number = 0;
  personas: any[]= [];
  rutF: string = '';
  selectedSegment: string;
  empleado: any = {};
  persona: any = {};
  coloresVehiculo: any[] = [];
  colores: any[] = [];
  patenteIngresada = false;
  cargos: any[] = [];
  regiones: any[] = [];
  comunas: any[] = [];
  condominios: any[] = [];
  edificios: any[] = [];
  departamentos: any[] = [];
  edificiosFiltrados: any[] = [];
  departamentosFiltrados: any[] = [];
  actualizacionExitosa = false;
  agregadoExitoso = false;
  datos: any;
  color: any;
  estadoSeleccionado: number;
  estados = [
    { label: 'Activo', valor: 1 },
    { label: 'Inactivo', valor: 0 }
  ];
  

  estado: any;
  actualizarDatos: any;
  colorSeleccionado: any = '';
  patente: any = '';
  vehiculo: any;

  tiposVehiculo: any[] = [];
  idTipoveh: number = 0; // Asignar un valor inicial, por ejemplo, 0

  tipoVehSeleccionado: any = '';

  residenteSeleccionado: any = '';

  mostrarFormularioAgregar: boolean = false; // Agregada la variable mostrarFormularioAgregar
  mostrarFormularioEditar: boolean = false; // Agregada la variable mostrarFormularioEditar

  intervalId: any;



  vehiculoForm: any = {
    patente: '',
    id_tipoveh: '',
    id_color: '',
    estado: ''
  };

  

  validarRutDV(rut: string = ''): boolean {
    if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
      return false; // El formato del Rut es incorrecto
    }

    const rutDigits = rut.split('-')[0]; // Obtener los dígitos del Rut
    const dv = rut.split('-')[1].toUpperCase(); // Obtener el dígito verificador y convertirlo a mayúsculas
    const rutNumbers = Array.from(rutDigits).reverse().map(Number); // Convertir los dígitos del Rut a un array y revertir el orden
    const factor = [2, 3, 4, 5, 6, 7, 2, 3]; // Factor para el cálculo del dígito verificador

    let sum = 0;
    for (let i = 0; i < rutNumbers.length; i++) {
      sum += rutNumbers[i] * factor[i % 8];
    }

    const expectedDV = 11 - (sum % 11); // Calcular el dígito verificador esperado
    const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : String(expectedDV); // Obtener el dígito verificador calculado

    return dv === calculatedDV; // Comparar el dígito verificador ingresado con el calculado
  }

  constructor(
    private gestionService: GestionService,
    private apiService: ApiService,
    private alertController: AlertController,
    private formsModule: FormsModule,
  ) {
    this.selectedSegment = 'empleados';
    this.estadoSeleccionado = 0;
  }

  ngOnInit() {
    this.obtenerRegiones();
    this.obtenerCondominios();
    this.obtenerCargos();
    this.obtenerEdificios();
    this.obtenerDepartamentos();
    this.obtenerColoresVehiculo();    
    this.obtenerEstadosVehiculo();
    this.obtenerTiposVehiculo();
    this.intervalId = setInterval(() => {
      this.miFuncion();
    }, 5000);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  miFuncion(){
    this.obtenerColoresVehiculo();
  }

  obtenerCargos() {
    this.gestionService.obtenerCargos().subscribe(
      (data: any) => {
        this.cargos = data;
      },
      (error: any) => {
        console.error('Error al obtener los cargos:', error);
      }
    );
  }

  obtenerComunas() {
    this.gestionService.obtenerComunas().subscribe(
      (data: any) => {
        this.comunas = data;
      },
      (error: any) => {
        console.error('Error al obtener las comunas:', error);
      }
    );
  }

  obtenerRegiones() {
    this.gestionService.obtenerRegiones().subscribe(
      (data: any) => {
        this.regiones = data;
      },
      (error: any) => {
        console.error('Error al obtener las regiones:', error);
      }
    );
  }

  buscarComunasPorRegion(id_region: string) {
    this.gestionService.buscarComunasPorRegion(id_region).subscribe((comunas: any[]) => {
      this.comunas = comunas;
      this.empleado.comuna = null;
    });
  }

  obtenerCondominios() {
    this.gestionService.obtenerCondominios().subscribe(
      (data: any) => {
        this.condominios = data;
      },
      (error: any) => {
        console.error('Error al obtener los condominios:', error);
      }
    );
  }
  obtenerEdificios() {
    this.gestionService.obtenerEdificios().subscribe(
      (data: any) => {
        this.edificios = data;
      },
      (error: any) => {
        console.error('Error al obtener los edificios:', error);
      }
    );
  }
  filtrarEdificios() {
    if (this.persona.condominioPersona) {
      this.edificiosFiltrados = this.edificios.filter(edificio => edificio.id_conjunto === this.persona.condominioPersona);
    } else {
      this.edificiosFiltrados = [];
    }
    this.persona.edificioPersona = null; // Restablecer la selección del edificio
    this.departamentosFiltrados = []; // Restablecer la lista de departamentos
  }

  obtenerDepartamentos() {
    this.gestionService.obtenerDepartamentos().subscribe(
      (data: any) => {
        this.departamentos = data;
      },
      (error: any) => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }
  obtenerVehPersona() {
    this.apiService.obtenerVehPersona().subscribe(
      (data) => {
        this.personas = data;
        console.log('Tipos de persona/veh obtenidos:', this.personas);
      },
      (error) => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }
  guardarDatosVehiculo() {
    if (this.residenteSeleccionado) {
      // Accede a los datos del residente seleccionado
      const rut = this.residenteSeleccionado.rut;
      const nombre = this.residenteSeleccionado.primer_nombre;
      const apellido = this.residenteSeleccionado.primer_apellido;
      // Guarda los datos o realiza las acciones necesarias
      console.log('Datos del residente seleccionado:', rut, nombre, apellido);
          // Agrega el console.log para verificar residenteSeleccionado
    console.log('Residente seleccionado:', this.residenteSeleccionado);
    } else {
      console.error('No se ha seleccionado un residente.');
    }
  }


  agregarVehiculoResidente(): void {
    const vehiculo = {
      patente: this.vehiculo.patente,
      id_tipoveh: this.idTipoveh,
      id_color: this.colorSeleccionado,
      estado: 1
    };
  
    this.apiService.agregarVehiculoResidente(vehiculo)
      .subscribe(
        response => {
          console.log('Vehículo agregado exitosamente.');
  
          const rutResidente = this.residenteSeleccionado;
  
          this.apiService.agregarPersonaVehiculo(rutResidente, vehiculo.patente, 4)
            .subscribe(
              response => {
                console.log('Vehículo agregado al residente exitosamente.');
                // Manejar la respuesta aquí según tus necesidades
              },
              error => {
                console.error('Error al agregar el vehículo al residente:', error);
                // Manejar el error aquí según tus necesidades
              }
            );
        },
        error => {
          console.error('Error al agregar el vehículo:', error);
          // Manejar el error aquí según tus necesidades
        }
      );
  }
  guardar(): void {
    const vehiculo = {
      patente: this.patenteValue,
      id_tipoveh: 2,
      id_color: 1,
      estado: 1
    };

    this.apiService.agregarVehiculoResidente(vehiculo)
      .subscribe(
        response => {
          console.log('Vehículo agregado exitosamente.');

          const rut = this.rut;
          const patente = this.patenteValue;
          const id_est = this.id_est;

          this.apiService.agregarPersonaVehiculo(rut, patente, id_est)
            .subscribe(
              response => {
                console.log('Vehículo agregado a la persona exitosamente.');
                // Manejar la respuesta aquí según tus necesidades
              },
              error => {
                console.error('Error al agregar el vehículo a la persona:', error);
                // Manejar el error aquí según tus necesidades
              }
            );
        },
        error => {
          console.error('Error al agregar el vehículo:', error);
          // Manejar el error aquí según tus necesidades
        }
      );
  }

  enviartodo(){
    this.agregarVehiculoResidente();
    this.guardar();
  }
  
  
  

  filtrarDepartamentos() {
    if (this.persona.edificioPersona) {
      this.departamentosFiltrados = this.departamentos.filter(departamento => departamento.id_edificio === this.persona.edificioPersona);
    } else {
      this.departamentosFiltrados = [];
    }
    this.persona.departamentoPersona = null; // Restablecer la selección del departamento
  }
  

  onChangeRegion(): void {
    const selectedRegionId = this.empleado.value.region;
    this.buscarComunasPorRegion(selectedRegionId);
  
    const regionFormControl = this.empleado.get('region');
    regionFormControl?.setValue(selectedRegionId);
  }  

  async guardarEmpleado() {
  // Validar si hay campos requeridos sin completar
  if (!this.rutF || !this.empleado.primerNombre || !this.empleado.primerApellido || !this.empleado.correo || !this.empleado.direccion || !this.empleado.region || !this.empleado.comuna || !this.empleado.condominioEmpleado || !this.empleado.cargoEmpleado) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Faltan completar campos requeridos',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  // Validar el formato del RUT
  const regexRut = /^\d{7,8}-[0-9Kk]$/;
  if (!regexRut.test(this.rutF)) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El campo de RUT no tiene un formato válido. Ej: 12345678-K',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

// Validar el formato del nombre y apellido
const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
if ((this.empleado.primerNombre && !regexNombreApellido.test(this.empleado.primerNombre)) || (this.empleado.segundoNombre && !regexNombreApellido.test(this.empleado.segundoNombre)) || !regexNombreApellido.test(this.empleado.primerApellido) || (this.empleado.segundoApellido && !regexNombreApellido.test(this.empleado.segundoApellido))) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: 'Los campos de nombre y apellido solo pueden contener letras y acentos',
    buttons: ['OK']
  });
  await alert.present();
  return;
}

  // Validar el formato de la dirección
  const regexDireccion = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;
  if (!regexDireccion.test(this.empleado.direccion)) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El campo de dirección solo puede contener letras, acentos y números',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }
  // Validar el formato del correo
const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (this.empleado.correo && !regexCorreo.test(this.empleado.correo)) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: 'El campo de correo no tiene un formato válido',
    buttons: ['OK']
  });
  await alert.present();
  return;
}
  
    const rut = this.rutF.split('-')[0];
    const dv = this.rutF.split('-')[1] ? this.rutF.split('-')[1].toUpperCase() : '';
    const empleadoData = {
      rut: rut,
      dv: dv,
      primer_nombre: this.empleado.primerNombre,
      segundo_nombre: this.empleado.segundoNombre,
      primer_apellido: this.empleado.primerApellido,
      segundo_apellido: this.empleado.segundoApellido,
      direccion: this.empleado.direccion,
      mail: this.empleado.correo,
      estatus: 1, // Define el estatus según tus necesidades
      id_cargo: this.empleado.cargoEmpleado,
      id_conjunto: this.empleado.condominioEmpleado,
      id_comuna: this.empleado.comuna,
      id_region: this.empleado.region
    };
  
    try {
      const response = await this.gestionService.agregarEmpleado(empleadoData).toPromise();
      console.log('Empleado agregado correctamente:', response);
      // Realiza las acciones necesarias después de agregar el empleado, como mostrar un mensaje de éxito, redirigir a otra página, etc.
  
      // Mostrar la alerta
      const alert = await this.alertController.create({
        header: 'Empleado agregado Exitosamente',
        message: `Credenciales del empleado:\nUsuario: ${response.usuario}\nClave: ${response.clave}\n\nRecuerde que debe respaldar las credenciales.`,
        buttons: ['OK']
      });
  
      await alert.present();
    } catch (error) {
      console.error('Error al agregar el empleado:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al agregar el empleado',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }
  
  async guardarResidente() {
// Validar si hay campos requeridos sin completar
if (!this.rutF || !this.persona.primerNombre || !this.persona.primerApellido || !this.persona.correo || !this.persona.tipo_persona || !this.persona.condominioPersona || !this.persona.edificioPersona || !this.persona.departamentoPersona) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: 'Faltan completar campos requeridos',
    buttons: ['OK']
  });
  await alert.present();
  return;
}

// Validar el formato del nombre y apellido
const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
if ((this.persona.primerNombre && !regexNombreApellido.test(this.persona.primerNombre)) || (this.persona.segundoNombre && !regexNombreApellido.test(this.persona.segundoNombre)) || !regexNombreApellido.test(this.persona.primerApellido) || (this.persona.segundoApellido && !regexNombreApellido.test(this.persona.segundoApellido))) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: 'Los campos de nombre y apellido solo pueden contener letras y acentos',
    buttons: ['OK']
  });
  await alert.present();
  return;
}
  // Validar el formato del RUT
  const regexRut = /^\d{7,8}-[0-9Kk]$/;
  if (!regexRut.test(this.rutF)) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El campo de RUT no tiene un formato válido',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

// Validar el formato del correo
const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (this.persona.correo && !regexCorreo.test(this.persona.correo)) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: 'El campo de correo no tiene un formato válido',
    buttons: ['OK']
  });
  await alert.present();
  return;
}
  
    const rut = this.rutF.split('-')[0];
    const dv = this.rutF.split('-')[1] ? this.rutF.split('-')[1].toUpperCase() : '';
  
    // Obtener la dirección del conjunto residencial seleccionado
    const conjuntoResidencial = this.condominios.find(condominio => condominio.id_conjunto === this.persona.condominioPersona);
    const direccionConjunto = conjuntoResidencial ? conjuntoResidencial.direccion_conjunto : '';
  
    const residenteData = {
      rut: rut,
      dv: dv,
      primer_nombre: this.persona.primerNombre,
      segundo_nombre: this.persona.segundoNombre,
      primer_apellido: this.persona.primerApellido,
      segundo_apellido: this.persona.segundoApellido,
      direccion: direccionConjunto,
      mail: this.persona.correo,
      estado: 1,
      tip_per: this.persona.tipo_persona,
      id_departamento: this.persona.departamentoPersona,
      id_edificio: this.persona.edificioPersona,
      id_conjunto: this.persona.condominioPersona,
    };
  
    try {
      await this.gestionService.agregarResidente(residenteData).toPromise();
      console.log('Residente agregado correctamente');
      const alert = await this.alertController.create({
        header: 'Residente agregado exitosamente',
        message: 'Se agregó el residente correctamente',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al agregar el residente:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al agregar el residente',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // SEGMENTO DE VEHICULO
  obtenerDatosVehiculo(patente: string) {
    this.apiService.obtenerDatosVehiculo(patente).subscribe(
      (response) => {
        this.vehiculo = response;
      },
      (error) => {
        console.error('Error al obtener el vehículo:', error);
      }
    );
  }

  buscar() {
    try {
      const patenteFormatted = this.patente.toUpperCase().replace(/-/g, '').replace(/_/g, '');
  
      if (patenteFormatted.trim() === '') {
        // Manejar caso en que la patente está vacía
        return;
      } else {
        const patente: patente = { patente: patenteFormatted };
  
        this.apiService.obtenerDatosVehiculo(patenteFormatted).subscribe(
          (data: any) => {
            this.vehiculo = data;
  
            if (!this.vehiculo) {
              // Manejar caso en que no se encontró el vehículo
              this.obtenerColoresVehiculo(); // Obtener los colores de vehículo
              this.obtenerTiposVehiculo(); // Obtener los tipos de vehículo
              this.obtenerVehPersona(); // Obtener los datos de persona/vehículo
              this.mostrarFormularioAgregar = true; // Mostrar el formulario de agregar
            } else {
              console.log(this.vehiculo.estado);
              // Realizar acciones adicionales si se encontró el vehículo
  
              // Cargar los datos de id_color y estado en los combo-box
              this.colorSeleccionado = this.vehiculo.id_color;
              this.estadoSeleccionado = Number(this.vehiculo.estado);
  
              // Llamar a obtenerVehPersona() aquí
              this.obtenerVehPersona();
  
              this.mostrarFormularioEditar = true; // Mostrar el formulario de editar
            }
          },
          (error: any) => {
            // Manejar error de la solicitud HTTP
            let errorMessage = 'Se produjo un error'; // Asignación de un valor a la variable errorMessage
            console.error(errorMessage);
            this.obtenerColoresVehiculo(); // Obtener los colores de vehículo
            this.obtenerTiposVehiculo(); // Obtener los tipos de vehículo
            this.obtenerVehPersona(); // Obtener los datos de persona/vehículo
            this.mostrarFormularioAgregar = true; // Mostrar el formulario de agregar en caso de error
          }
        );
      }
    } catch (error) {
      let errorMessage = 'Se produjo un error'; // Asignación de un valor a la variable errorMessage
      console.error(errorMessage);
      this.mostrarFormularioAgregar = true; // Mostrar el formulario de agregar en caso de error
      // Manejar el error de acuerdo a tus necesidades
      this.obtenerColoresVehiculo(); // Obtener los colores de vehículo
      this.obtenerTiposVehiculo(); // Obtener los tipos de vehículo
      this.obtenerVehPersona(); // Obtener los datos de persona/vehículo
    }
  }
  

  obtenerColoresVehiculo() {
    this.apiService.obtenerColoresVehiculo().subscribe(
      (colores: any[]) => {
        this.colores = colores;
        console.log(colores);
      },
      (error) => {
        console.error('Error al obtener colores de vehículo:', error);
      }
    );
  }

  seleccionarColor(event: any) {
    this.colorSeleccionado = event.detail.value;
    console.log('Opción seleccionada:', this.colorSeleccionado);
    // Aquí puedes realizar acciones adicionales con la opción seleccionada
  }

  obtenerEstadosVehiculo() {
    this.gestionService.obtenerEstadosVehiculo().subscribe(
      (estados: any[]) => {
        this.estados = estados;
      },
      (error) => {
        console.error('Error al obtener estados de vehículo:', error);
      }
    );
  }
  
  obtenerVehiculo(patente: string) {
    return this.apiService.obtenerDatosVehiculo(patente);
  }
  actualizarVehiculo() {
    const patente = this.vehiculo.patente; // Reemplaza con la patente deseada
    const id_color = this.colorSeleccionado; // Reemplaza con el nuevo id_color
    const estado = this.estadoSeleccionado; // Reemplaza con el nuevo estado

    this.apiService
      .actualizarVehiculo(patente, id_color, estado)
      .subscribe(
        () => {
          console.log('Registro actualizado exitosamente.');
          // Realizar acciones adicionales después de la actualización
        },
        (error) => {
          console.error('Error al actualizar el registro:', error);
          // Manejar el error adecuadamente
        }
      );
  }
  obtenerTiposVehiculo() {
    this.apiService.obtenerTiposVehiculo().subscribe(
      (data) => {
        this.tiposVehiculo = data;
        console.log('Tipos de vehículo obtenidos:', this.tiposVehiculo);
      },
      (error) => {
        console.log('Error al obtener tipos de vehículo:', error);
      }
    );
  }

  seleccionarTipoVehiculo(event: any) {
    this.tipoVehSeleccionado = event.detail.value;
    console.log('Opción seleccionada:', this.tipoVehSeleccionado);
    // Aquí puedes realizar acciones adicionales con la opción seleccionada
  }

  agregarVehiculo(){

  }
}
