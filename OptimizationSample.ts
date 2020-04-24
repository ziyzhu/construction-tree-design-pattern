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

interface IMeeting {
  nPeople: number; // number of attendees
}

class GenericDataObject {
  private key: string;
  private data: IGenericData;
  private children: GenericDataObject[];

  // greedily reserve a room and return room information
  public scheduleMeeting(meeting: IMeeting): RoomDataObject | undefined {
    // get all the rooms that belong to the current Data Object
    let dataObjectList = [this];
    let rooms = [this];

    while (!(dataObjectList[0] instanceof RoomDataObject)) {
      rooms = [];
      for (const dataObject of dataObjectList) {
        rooms.concat(dataObject.children);
      }
      dataObjectList = rooms;
    }

    // sort ascendingly in the order of room capacity;
    (rooms as RoomDataObject[]).sort(function(roomA, roomB) {
      return roomA.nSeat - roomB.nSeat;
    });

    // find the room that satisfies the minimal requirement
    for (const room of rooms) {
      if (room.isAvailable && room.nSeat >= meeting.nPeople) {
        room.isAvailable = false; // reserve it
        return room;
      }
    }
    return undefined;
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
