export class RegexType {
  private steps: RegExp[] = [];

  constructor(...steps: string[]) {
    for(let str of steps) {
      this.steps.push(this.createRegExp(str));
    }
  }

  getSteps(): RegExp[] {
    return this.steps;
  }

  private createRegExp(str: string): RegExp {
    return new RegExp(str, 'g'); // with global flag
  }
}