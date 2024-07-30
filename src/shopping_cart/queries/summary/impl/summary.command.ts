export class FindManyProductsByIdsCommand {
  constructor(public readonly ids: number[]) {}
}
