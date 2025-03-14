import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Gadget } from '../models/gadget';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  gadgets?: T[];
  data?: T | T[];
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GadgetService {
  private apiUrl = 'http://localhost:3000/api/gadgets';
  private baseImageUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  getFullImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) return '/assets/placeholder-image.png';
    if (
      typeof imageUrl === 'string' && (
        imageUrl.startsWith('http') || 
        imageUrl.startsWith('data:') || 
        imageUrl.startsWith('blob:')
      )
    ) {
      return imageUrl;
    }
    return `${this.baseImageUrl}${imageUrl}`;
  }

  getAllGadgets(
    page: number = 1, 
    limit: number = 10, 
    search?: string
  ): Observable<{
    gadgets: Gadget[]; 
    page: number; 
    limit: number;
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<Gadget>>(this.apiUrl, { params }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch gadgets');
        }
        const processedGadgets = (response.gadgets || []).map(gadget => {
          const safeImageUrl = this.getFullImageUrl(gadget.image_url);
          return {
            ...gadget,
            image_url: safeImageUrl
          };
        });
        return {
          gadgets: processedGadgets,
          page: response.page || 1,
          limit: response.limit || 10
        };
      }),
      catchError(this.handleError<{gadgets: Gadget[], page: number, limit: number}>(
        'getAllGadgets', 
        { gadgets: [], page: 1, limit: 10 }
      ))
    );
  }

  getGadgetById(id: number): Observable<Gadget> {
    return this.http.get<ApiResponse<Gadget>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch gadget');
        }
        const gadget = response.data || 
          (Array.isArray(response.gadgets) ? response.gadgets[0] : null);

        if (!gadget) {
          throw new Error('No gadget found');
        }
        return {
          ...(gadget as Gadget),
          image_url: this.getFullImageUrl((gadget as Gadget).image_url)
        };
      }),
      catchError(this.handleError<Gadget>('getGadgetById', {} as Gadget))
    );
  }

  createGadget(gadget: Gadget): Observable<Gadget> {
    return this.http.post<ApiResponse<Gadget>>(`${this.apiUrl}/single`, gadget).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to create gadget');
        }
        const createdGadget = response.data || 
          (Array.isArray(response.gadgets) ? response.gadgets[0] : null);
        if (!createdGadget) {
          throw new Error('No gadget created');
        }
        return {
          ...(createdGadget as Gadget),
          image_url: this.getFullImageUrl((createdGadget as Gadget).image_url)
        };
      }),
      catchError(this.handleError<Gadget>('createGadget', {} as Gadget))
    );
  }

  updateGadget(id: number, gadget: Partial<Gadget>): Observable<Gadget> {
    return this.http.put<ApiResponse<Gadget>>(`${this.apiUrl}/single/${id}`, gadget).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to update gadget');
        }
        const updatedGadget = response.data || 
          (Array.isArray(response.gadgets) ? response.gadgets[0] : null);

        if (!updatedGadget) {
          throw new Error('No gadget updated');
        }
        return {
          ...(updatedGadget as Gadget),
          image_url: this.getFullImageUrl((updatedGadget as Gadget).image_url)
        };
      }),
      catchError(this.handleError<Gadget>('updateGadget', {} as Gadget))
    );
  }

  deleteGadget(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/single/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete gadget');
        }
      }),
      catchError(this.handleError<void>('deleteGadget'))
    );
  }

  bulkDeleteGadgets(ids: number[]): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/bulk`, { 
      body: { ids } 
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete gadgets');
        }
      }),
      catchError(this.handleError<void>('bulkDeleteGadgets'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}