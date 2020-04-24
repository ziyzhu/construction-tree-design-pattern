# Construction Tree Design Pattern

A design pattern I created to implement iModel.js Frontend Applications.

# How it works

**Data Object** is an object created by a TypeScript class with external data. It contains a **Matching Key** value, which is the key value of a data item in the external data, and the value of that data item. In the following example, "PackardLab" would be the **Matching Key** value, and "BuildingNumber" and "BuildingName" would be stored in the "data" field of this **Data Object**.
```TypeScript
{"PackardLab": {'BuildingNumber': '78', 'BuildingName': '2001'}}
```

A **Data Object** extends this base class: 
```TypeScript
class GenericDataObject {
	private key: string; // Matching Key (also called Data Object ID)
	private data: IGenericData; // define your own TypeScript interface base on the schema of your data
	constructor(key: string, data: IGenericData)  {
		this.key = key;
		this.data = data;
	}
}

```

Suppose that we get an array of dictionaries in JSON format from a HTTP response: 
```TypeScript
[
{'<building 1 key>': {'BuildingNumber': '78', 'YearBuilt': '2001', ...}}, 
{'<building 2 key>', {...} },
...
{'<building 100 key>', {...} },
{'<room 1 key>', {'RoomNumber': '12', 'Floor': '2'}},
{'<room 2 key>', {...} },
...
]
```
Instead of representing them with JSON, we will convert each member of the array as a **Data Object** (TypeScript syntactic-sugar object encapsulated in our program) and allow it to be connected with **other Data Objects**. As a result, we would instantiate one-hundred **Data Objects** to represent the data items in the array above. 

Remember people used to work with [flat-file database](https://en.wikipedia.org/wiki/Flat-file_database) before the idea of [relational database](https://en.wikipedia.org/wiki/Relational_model) was conceived which later dramatically increased the efficiency of enterprises' systems and allowed them to manage system complexities better. It is the same idea here but we're doing even more than that --- we not only allow each JSON data item to be seen as an atomic object, build **relationships (NOT inheritance)** between them, but also most importantly, allow them to be capable of [**messaging**](http://lists.squeakfoundation.org/pipermail/squeak-dev/1998-October/017019.html) (in [Alan Kay](https://en.wikipedia.org/wiki/Alan_Kay)'s term), likewise have member functions. We're bringing these JSON data items to life so that they can manage themselves and interact with others, and with them as our building blocks, we can start building a versatile yet controllable system. 

### Relationships:

By looking at these objects as nodes or vertices, we can build all sorts of data structures tailored to our app. One interesting data structure to describe a detailed building such as [the retail store sample](https://vieweronlysample.z13.web.core.windows.net/) would be a [tree data structure](https://en.wikipedia.org/wiki/Tree_%28data_structure%29) whose tree nodes and direct children are **Data Objects** and an array of **Data Objects**, respectively. **Data Objects** on a lower level down the tree are physically contained by their parent **Data Objects** in the real world such that a floor is physically contained in a building. The reason why tree structure is chosen is that it resembles the structure of constructions. For example, a building always has a hierarchy associated with its subparts such that a building includes floors, a floor includes rooms, and a room includes maybe windows. Higher-level **BuildingDataObjects** would contain a pointer (named "children") to an array containing the next lower level **FloorDataObjects**, and it continues until tree leaf nodes are reached. 

If your iModel is more like a map rather than a detailed building with your **Data Objects**. The choice of data structure depends on the nature of your iModel. A great benefit: once you have a proper data structure set up, you can run all kinds of algorithms associated with it. For example, a [Breadth-first Search Algorithm](https://en.wikipedia.org/wiki/Breadth-first_search) can run on a tree data structure to update buildings since users see the most outer surface of an iModel first. In this case, it might make less sense to run it on a graph data structure since users have an overview of all the elements in an iModel in which fewer components are contained or hidden by bigger components.

Note that it may not make sense to have an inheritance relationship between our sample **Data Objects** because they don't resemble each other in any way, a building is nowhere similar to a room. Instead, their relationship should be established by a data structure where they are interconnected by pointers.

### Messaging: 
Once a data structure is established to glue **Data Objects** together, the relationships between **Data Objects** can be leveraged to manipulate their interactions. In the following, I'll be using the same tree data structure whose tree nodes are BuildingDataObject, FloorDataObject, and RoomDataObject to illustrate the power of messaging. 

The three main benefits that messaging introduces: 
1. **Propagation**: A signal can be propagated from any tree node to its descendants and trigger them to call an inherited function until the bottom of the tree is reached. For example, if all three of our **Data Objects** need to call different API endpoints to update their data and the data of an entire building need to be updated, a way to implement this is by creating a generic update function that is inherited by all **Data Objects** classes, and override it with a specific implementation in these **Data Object** classes. Then, one can create another propagating function (also inherited by all **Data Object**) that not only calls the update function of the **Data Object** but its direct children, which then call the propagating function on their children... Eventually, the entire subtree including the starting node would update itself entirely. By calling an update function on a BuildingDataObject, all of the FloorDataObjects and RoomDataObjects would be consequently updated from their data source. Note that an update function is only an example. [My implementation of the example above](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/PropagationSample.ts). Various other interesting functions could be implemented such as a delete function that truncates the whole subtree. 

2. **Aggregation**: The member functions of tree nodes can be used to gather information from its descendants as well. For example, if a BuildingDataObject calls "getDailyPower()", this function would automatically and recursively get all the DailyPower value from its children, FloorDataObject, average them, and store as its DailyPower value; each FloorDataObject would then do the same thing to its children, RoomDataObject(s), which in this case are the leaf nodes so we will stop here. Each floor's DailyPower is calculated from their rooms' DailyPower and each building's DailyPower is calculated from the resulted DailyPower of their floors' DailyPower. [My implementation of this example.](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/AggregationSample.ts)

3. **Implicit Optimization**: With the power of propagation in a tree, implementing a **Data Object** member function that implicitly uses optimization algorithms can abstract away some of the complexity in our program. For example, if the goal is to maximize the number of meetings scheduled in a building or on a floor, the scheduler can greedily pick the room, with the least number of seats, that can hold all the meeting attendees. This [greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm) maximizes the number of meetings scheduled with two conditions: 1. meetings are scheduled in a First-in-First-out order and 2. the starting and ending time of a meeting are unknown. When a BuildingDataObject calls this function to schedule a meeting, it would implicitly use the greedy algorithm to optimally schedule a meeting in a building, while FloorDataObject would instead optimally schedule a meeting on a floor. [My implementation of this example.](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/OptimizationSample.ts)
