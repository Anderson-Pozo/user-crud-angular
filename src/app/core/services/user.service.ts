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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.headers,
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users`, {
      headers: this.headers,
      params: {
        id: `eq.${id}`,
        select: '*',
        limit: 1
      }
    });
  }

  createUser(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/users`, user, {
      headers: this.headers
    });
  }

  updateUser(id: string, user: Partial<User>): Observable<User[]> {
    return this.http.patch<User[]>(`${this.apiUrl}/users`, user, {
      headers: this.headers,
      params: {
        id: `eq.${id}`
      }
    });
  }

  deleteUser(id: string): Observable<User[]> {
    return this.http.delete<User[]>(`${this.apiUrl}/users`, {
      headers: this.headers,
      params: {
        id: `eq.${id}`
      }
    });
  }
}
