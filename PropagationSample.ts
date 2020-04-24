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

  private updateData() {
    // send a request to default API Endpoint
    // parse response data to update its data field
  }

  // update itself and its descendants
  private updateDataSubtree() {
    this.updateData();
    for (const child of this.children) {
      child.updateDataSubtree();
    }
  }
}

class BuildingDataObject extends GenericDataObject {
  private data: IBuildingData;
  private children: FloorDataObject[];

  private updateData() {
    // send a request to API Endpoint X}
    // parse response data to update its data field
  }
}

class FloorDataObject extends GenericDataObject {
  private data: IFloorData;
  private children: RoomDataObject[];

  private updateData() {
    // send a request to API Endpoint Y}
    // parse response data to update its data field
  }
}

class RoomDataObject extends GenericDataObject {
  private data: IRoomData;
  private children: []; // children will be empty since it's a leaf node.

  private updateData() {
    // send a request to API Endpoint Z}
    // parse response data to update its data field
  }
}
