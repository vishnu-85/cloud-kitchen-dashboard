import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { filter, map, Observable } from 'rxjs';
import { Loader } from '../../shared/components/loader/loader';

const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      imdbId
      posterURL
      title
    }
  }
`;

interface Movie {
  id: string;
  imdbId?: string;
  posterURL?: string;
  title?: string;
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {

  // public movies$!: Observable<Movie[]>;

  public movies:any = signal([])
  constructor(private readonly apollo: Apollo, private router: Router) { }

  ngOnInit(): void {
    this.apollo
      .watchQuery<{ movies: Movie[] }>({
        query: GET_MOVIES,
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(
        map((result: any) => result.data)
      ).subscribe(res=> {
        this.movies.set(res.movies)
      });
  }

  WatchMovie(id:string){
    this.router.navigateByUrl(`/admin/movies/${id}`)
  }
}