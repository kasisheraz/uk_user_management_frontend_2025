import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../services/auth.service';

@Pipe({
name: 'hasRole'
})
export class HasRolePipe implements PipeTransform {

transform(roles: Role[] | undefined, roleName: string): boolean {
    if (!roles || !roleName) {
      return false;
    }
    return roles.some(role => role.name === roleName);
  }
}