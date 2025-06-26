import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserMovieService } from '../../core/services/user-movie.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() averageRating: number = 0;
  @Input() totalUsers: number = 0;
  @Input() status: string = '';
  @Input() userRatingFromBackend: number | null = null;
  @Input() movieId!: number;

  @Output() refreshMovie = new EventEmitter<void>();

  userRating: number | null = null;
  hoverRating: number | null = null;
  watchStatus: string = '';
  userMovieId: number | null = null;

  constructor(
    private userMovieService: UserMovieService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'] && changes['status'].currentValue !== undefined) {
      this.watchStatus = changes['status'].currentValue;
    }

    if (changes['userRatingFromBackend'] && changes['userRatingFromBackend'].currentValue !== undefined) {
      this.userRating = changes['userRatingFromBackend'].currentValue;
    }

    if (changes['movieId'] && changes['movieId'].currentValue !== undefined) {
      this.loadUserMovieId();
    }
  }

  ngOnInit(): void {
    this.watchStatus = this.status;
    this.userRating = this.userRatingFromBackend;
    this.loadUserMovieId();
  }

  loadUserMovieId(): void {
    this.userMovieService.getUserMovie(this.movieId).subscribe({
      next: (data) => {
        this.userMovieId = data.id;
      },
      error: (err) => {
        if (err.status === 404) {
          this.userMovieId = this.movieId; 
        }
      },
    });
  }

  getRatingColor(rating: number): string {
    if (rating <= 4) return 'red';
    if (rating <= 6) return 'yellow';
    return 'green';
  }

  setUserRating(rating: number): void {
    if (this.watchStatus !== 'ja-assisti') return;

    const previousRating = this.userRating;
    this.userRating = rating;

    const body = { rating, status: this.watchStatus, movieId: this.movieId };

    if (this.userMovieId) {
      this.userMovieService.updateUserMovie(this.userMovieId, body).subscribe({
        next: () => {
          this.toastService.ratingUpdated();
          this.refreshMovie.emit();
        },
        error: () => {
          this.userRating = previousRating;
          this.toastService.genericError();
        },
      });
    } else {
      this.userMovieService.createUserMovie(body).subscribe({
        next: (res: any) => {
          this.userMovieId = res.id;
          this.toastService.ratingUpdated();
          this.refreshMovie.emit();
        },
        error: () => {
          this.userRating = previousRating;
          this.toastService.genericError();
        },
      });
    }
  }

  setHoverRating(rating: number): void {
    if (this.watchStatus !== 'ja-assisti') return;
    this.hoverRating = rating;
  }

  clearHover(): void {
    this.hoverRating = null;
  }

  getBarSegmentClasses(num: number): { [key: string]: boolean } {
    const isActive = num <= (this.hoverRating ?? this.userRating ?? 0);
    return {
      [this.getRatingColor(num)]: true,
      active: isActive,
    };
  }

  setWatchStatus(status: string): void {
    const previousStatus = this.watchStatus;

    if (this.watchStatus === status) {
      this.watchStatus = '';
      this.userRating = null;
    } else {
      this.watchStatus = status;
      if (status !== 'ja-assisti') {
        this.userRating = null;
      }
    }

    const body: any = { status: this.watchStatus, movieId: this.movieId };

    if (this.userMovieId) {
      this.userMovieService.updateUserMovie(this.userMovieId, body).subscribe({
        next: () => {
          this.toastService.statusUpdated();
          this.refreshMovie.emit();
        },
        error: () => {
          this.watchStatus = previousStatus;
          this.toastService.genericError();
        },
      });
    } else {
      this.userMovieService.createUserMovie(body).subscribe({
        next: (res: any) => {
          this.userMovieId = res.id;
          this.toastService.statusUpdated();
          this.refreshMovie.emit();
        },
        error: () => {
          this.watchStatus = previousStatus;
          this.toastService.genericError();
        },
      });
    }
  }

  isStatusActive(status: string): boolean {
    return this.watchStatus === status;
  }
}
