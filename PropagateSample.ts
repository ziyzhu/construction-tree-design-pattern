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

  private updateData(propagate: boolean) {
    // send a request to default API Endpoint

    // updates its children
    if (propagate) {
      for (const child of this.children) {
        child.updateData(true);
      }
    }
  }
}

class BuildingDataObject extends GenericDataObject {
  private data: IBuildingData;
  private children: FloorDataObject[];

  private updateData(propagate: boolean) {
    // send a request to API Endpoint X} and parse response data to update itself
  }
}

class FloorDataObject extends GenericDataObject {
  private data: IFloorData;
  private children: RoomDataObject[];

  private updateData(propagate: boolean) {
    // send a request to API Endpoint Y} and parse response data to update itself
  }
}

class RoomDataObject extends GenericDataObject {
  private data: IRoomData;
  private children: []; // children is empty since it's a leaf node.

  private updateData(propagate: boolean) {
    // send a request to API Endpoint Z} and parse response data to update itself
  }
}
