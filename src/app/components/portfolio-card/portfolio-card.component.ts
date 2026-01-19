import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-card.component.html',
  styleUrl: './portfolio-card.component.scss',
})
export class PortfolioCardComponent {
  @Input({ required: true }) portfolio!: Portfolio;

  get initials(): string {
    return this.portfolio.owner
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  get domain(): string {
    try {
      return new URL(this.portfolio.url).hostname.replace('www.', '');
    } catch {
      return this.portfolio.url;
    }
  }
}
