import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { filter, map, Observable } from 'rxjs';
import { Loader } from '../../../shared/components/loader/loader';

const GET_MOVIE = gql`
  query GetMovies($movieId: ID!) {
    movie(id: $movieId) {
      title
      posterURL
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
    selector: 'app-movie-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, Loader],
    templateUrl: 'movie-details.html',
})
export class MovieDetails implements OnInit {

    movieId: any;
    public movie$!: Observable<any>;
    constructor(private readonly apollo: Apollo,
        private activateRouter: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activateRouter.params.subscribe((res: any) => {
            this.movieId = res.id;            
        })
       this.movie$ = this.apollo
            .watchQuery({
                query: GET_MOVIE,
                variables: {
                movieId: this.movieId
                },
                fetchPolicy: 'network-only'
            })
            .valueChanges.pipe(
                map((result:any) => result.data)
            );
    }

}