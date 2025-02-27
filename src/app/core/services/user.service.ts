import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '@interfaces/user';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.supabaseUrl}/rest/v1`;
  private headers = new HttpHeaders({
    'apikey': environment.supabaseKey,
    'Authorization': `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  });

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.headers,
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.headers,
      params: {
        id: `eq.${id}`,
        select: '*',
        limit: 1
      }
    });
  }

  createUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user, {
      headers: this.headers
    });
  }

  updateUser(id: string, user: Partial<User>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users`, user, {
      headers: this.headers,
      params: {
        id: `eq.${id}`
      }
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users`, {
      headers: this.headers,
      params: {
        id: `eq.${id}`
      }
    });
  }
}
