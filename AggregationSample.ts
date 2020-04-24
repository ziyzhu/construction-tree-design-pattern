interface IGenericData {
  matchingKey: string;
}

interface IBuildingData extends IGenericData {
  buildingName: string;
  buildingNumber: string;
}

interface IFloorData extends IGenericData {
  floorNumber: string;
  areaInMeterSquare: string;
}

interface IRoomData extends IGenericData {
  roomName: string;
  roomNumber: string;
  isAvailable: boolean;
  nSeat: number; // seat capacity
}

class GenericDataObject {
  private key: string;
  private data: IGenericData;
  private children: GenericDataObject[];

  public getDailyEnergy() {
    let totalEnergy = 0;

    for (const child of this.children) {
      totalEnergy += child.getDailyEnergy();
    }

    const averageEnergy = this.children.length > 0 ? total / this.children.length : 0;

    return averageEnergy;
  }
}

class BuildingDataObject extends GenericDataObject {
  private data: IBuildingData;
  private children: FloorDataObject[]; // a building could have multiple floors.
}

class FloorDataObject extends GenericDataObject {
  private data: IFloorData;
  private children: RoomDataObject[];
}

class RoomDataObject extends GenericDataObject {
  private data: IRoomData;
  // children is empty since it's a leaf node.
  private children: [];
}
