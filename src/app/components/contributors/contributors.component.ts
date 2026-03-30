import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributorsService, Contributor } from '../../services/contributors.service';

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
})
export class ContributorsComponent implements OnInit {
  private contributorsService = inject(ContributorsService);
  contributors: Contributor[] = [];

  ngOnInit(): void {
    this.contributorsService.getContributors().subscribe((data) => {
      this.contributors = data;
    });
  }
}
