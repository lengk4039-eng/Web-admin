import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

/**
 * Shell layout shown for every page after login: sidebar on the left,
 * top navbar, and the routed page content in the middle.
 *
 * On screens narrower than 900px the sidebar becomes an overlay drawer
 * that slides in/out instead of being permanently docked.
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, SidebarComponent, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  pageTitle = 'Dashboard';

  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.readTitleFromRoute()),
        takeUntil(this.destroy$),
      )
      .subscribe((title) => {
        this.pageTitle = title;
      });

    this.pageTitle = this.readTitleFromRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuToggle(): void {
    this.sidenav.toggle();
  }

  onSidebarLinkClicked(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  onLogout(): void {
    // Wired up to auth.service.ts in Stage 2.
    this.router.navigate(['/login']);
  }

  private readTitleFromRoute(): string {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route?.snapshot.data['title'] ?? 'Dashboard';
  }
}
