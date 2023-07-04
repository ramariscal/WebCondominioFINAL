import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../event.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GestionService {
  private cargosEndPoint = 'buscarCargos';
  private comunasEndPoint = 'buscarComunas';
  private regionesEndPoint = 'buscarRegiones';
  private buscarComunasPorRegionEndPoint = 'buscarComunasPorRegion';
  private condominiosEndPoint = 'buscarCondominio';
  private buscarRegionPorComunaEndPoint = 'buscarRegionPorComuna';
  private edificioEndPoint = 'buscarEdificio';
  private departamentoEndPoint = 'buscarDepartamento';

  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private httpClient: HttpClient
  ) {}

  obtenerCargos(): Observable<any> {
    return this.apiService.get(this.cargosEndPoint);
  }

  obtenerComunas(): Observable<any> {
    return this.apiService.get(this.comunasEndPoint);
  }

  obtenerRegiones(): Observable<any> {
    return this.apiService.get(this.regionesEndPoint);
  }

  buscarComunasPorRegion(id_region: string): Observable<any> {
    const url = `${this.buscarComunasPorRegionEndPoint}/${id_region}`;
    return this.apiService.get(url);
  }

  buscarRegionPorComuna(id_comuna: string): Observable<any> {
    const url = `${this.buscarRegionPorComunaEndPoint}/${id_comuna}`;
    return this.apiService.get(url);
  }

  obtenerCondominios(): Observable<any> {
    return this.apiService.get(this.condominiosEndPoint);
  }
  obtenerEdificios(): Observable<any> {
    return this.apiService.get(this.edificioEndPoint);
  }
  obtenerDepartamentos(): Observable<any> {
    return this.apiService.get(this.departamentoEndPoint);
  }

  agregarEmpleado(empleadoData: any): Observable<any> {
    return this.apiService.post('agregarEmpleado', empleadoData);
  }
  agregarResidente(residenteData: any): Observable<any> {
    return this.apiService.post('agregarResidente', residenteData);
  }

  // SEGMENTO DE VEHICULO
  verificarPatente(patente: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.verificarPatente(patente).subscribe(
        (response) => {
          resolve(response.existe);
        },
        (error) => {
          console.error('Error al verificar la patente:', error);
          reject(error);
        }
      );
    });
  }
  
  obtenerVehiculo(patente: string) {
    return this.apiService.obtenerDatosVehiculo(patente);
  }
  // Método para actualizar un vehículo
  actualizarVehiculo(patente: string, datos: any): Observable<any> {
    return this.apiService.actualizarVehiculo(patente, datos);
  }
  
  obtenerColoresVehiculo(): Observable<any[]> {
    const url = 'obtenerColorVeh';
    return this.apiService.get(url);
  }

  obtenerEstadosVehiculo(): Observable<any[]> {
    const url = 'obtenerEstadosVeh';
    return this.apiService.get(url);
  }
  
}
