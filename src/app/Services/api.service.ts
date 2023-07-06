import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Reemplaza la URL por la correcta de tu API

  constructor(private http: HttpClient, private eventService: EventService) { }

  get(endpoint: string, params?: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get(url, { params }).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }

  post(endpoint: string, body: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post(url, body).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }
  
  put(endpoint: string, body: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.put(url, body).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }

  authenticate(usuario: string, clave: string): Observable<any> {
    const url = `${this.apiUrl}/authenticate`; // URL para la autenticación, ajusta según tu API
    const body = {
      usuario: usuario,
      clave: clave
    };

    return this.http.post(url, body).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }

  agregarEmpleado(empleadoData: any): Observable<any> {
    const endpoint = 'agregarEmpleado';
    return this.http.post(endpoint, empleadoData).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }

  agregarResidente(residenteData: any): Observable<any> {
    const endpoint = 'agregarResidente';
    return this.http.post(endpoint, residenteData).pipe(
      tap((response) => {
        // Emitir el evento con la respuesta
        this.eventService.emitApiResponse(response);
      })
    );
  }
  
// SEGMENTO DE GESION > VEHICULO:
  verificarPatente(patente: string): Observable<any> {
    const url = `${this.apiUrl}/verificarPatente/${patente}`;
    return this.http.get(url);
  }

    guardarVehiculo(vehiculo: any) {
    const url = `${this.apiUrl}/vehiculos`; // Reemplaza con la ruta correspondiente en tu API

    // Realiza una solicitud POST para guardar el vehículo en la base de datos
    return this.http.post(url, vehiculo);
  }  
      obtenerDatosVehiculo(patente: string): Observable<any> {
    const url = `${this.apiUrl}/buscarVehiculo?patente=${patente}`;
    return this.http.get<any>(url);
  }

  obtenerColoresVehiculo(): Observable<any[]> {
    const url = `${this.apiUrl}/obtenerColorVeh`;
    return this.http.get<any[]>(url);
  }
  
  obtenerEstadosVehiculo(): Observable<any[]> {
    const url = '/obtenerEstadosVeh';
    return this.http.get<any[]>(url);
  }
  
  actualizarVehiculo(patente: string, id_color: number, estado: number): Observable<any> {
    const url = `${this.apiUrl}/vehiculos/${patente}`;
    const body = { id_color, estado };

    return this.http.put(url, body);
  }

  obtenerTiposVehiculo(): Observable<any[]> {
    const url = `${this.apiUrl}/obtenerTipoVeh`;

    return this.http.get<any[]>(url);
  }
  
  obtenerVehPersona(): Observable<any[]> {
    const url = `${this.apiUrl}/registroVehiculoPersona`;
    return this.http.get<any[]>(url);
  }

  agregarVehiculoResidente(vehiculo: any): Observable<any> {
    const url = `${this.apiUrl}/agregarVehiculo`;
    return this.http.post(url, vehiculo);
  }
  agregarPersonaVehiculo(rut: string, patente: string, id_est: number): Observable<any> {
    const url = `${this.apiUrl}/personaVehiculo`;
    const data = { rut, patente, id_est };
    return this.http.post(url, data);
  }
  // Agrega más métodos según tus necesidades (put, delete, etc.)
}
