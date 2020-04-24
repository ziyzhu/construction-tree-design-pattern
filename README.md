
# Construction Tree Design Pattern
A design pattern I designed to implement iModel.js Frontend Applications. 


# How it works

**Data Object** is an object created by a TypeScript class. It contains a key value and external data. 

A **Data Object** extends this base class: 
```TypeScript
class GenericDataObject {
	private key: string; // Matching Key (namely Data Object ID)
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
Instead of representing them with JSON or a dictionary, we convert each member of the array as a TypeScript/JavaSript syntactic-sugar object encapsulated in our program and allow it to be connected with **other Data Objects**, namely other buildings. As a result, we would instantiate one-hundred **Data Objects** each representing each data item in the array above. Remember people used to work with [flat file database](https://en.wikipedia.org/wiki/Flat-file_database) before the idea of [relational database](https://en.wikipedia.org/wiki/Relational_model) was conceived which later dramatically increased the efficiency of enterprises' systems and allowed them to manage system complexities better. It is the same idea here but we're doing even more than that --- we not only allow each JSON data item to be seen as a discrete, atomic object, and build **relationships (NOT inheritance)** between them, but also most importantly, allow them to be capable of [**messaging**](http://lists.squeakfoundation.org/pipermail/squeak-dev/1998-October/017019.html) ([Alan Kay](https://en.wikipedia.org/wiki/Alan_Kay)'s term), likewise possessing functions. We're bringing these constructions to life so that they can manage themselves and interact with others, and with them, we can build out any complex systems. 

### Relationships:

With the key values of these objects, we can build all sorts of data structures tailored to our app. One interesting data structure would be [tree data structure](https://en.wikipedia.org/wiki/Tree_%28data_structure%29) where **Data Objects** are tree nodes, given that we have the data for sub-components of a building. Why a tree? Because it resembles the structure of constructions. A building always has a hierarchy associated with its sub-components such that a building includes floors, a floor includes rooms, and a room includes maybe windows. In this tree, higher level **BuildingDataObjects** would contain a pointer to an array containing the next lower level **FloorDataObjects**, and it continues until tree leaf nodes are reached. 

If your iModel is more like a map rather than a detailed building, you could even create a [graph data structure](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29) with your **Data Objects**. The choice of data structure depends on the nature of your iModel. A great benefit: once you have a data structure, you can run all kinds of algorithms associated with it. For example, a [Breadth-first Search Algorithm](https://en.wikipedia.org/wiki/Breadth-first_search) can run on a tree data structure to update buildings since users see the most outer surface of an iModel first. In this case, it might make less sense to run it on a graph data structure since users basically have an overview of all the elements in an iModel, where fewer components are contained or hidden by bigger components.

Note that it would not make sense to have an inheritance relationship between **Data Objects** because they don't resemble each other in any way, a building is nowhere similar to a room. Instead, their relationship should be established by a data structure where they are interconnected by pointers.

### Messaging: 
Once a data structure is established to glue **Data Objects** together, the relationships between **Data Objects** can be leveraged to manipulate their interactions. In the following, I'll be using a tree data structure whose tree nodes are **Data Objects** and  the previously mentioned **Data Objects**: BuildingDataObject, FloorDataObject, and RoomDataObject to illustrate the power of messaging. 

The three main benefits that messaging introduces: 
1. **Propagation**: A signal can be propagated down from any tree node to its descendants and trigger them to call an inherited function until the bottom of the tree is reached. For example, if all three of our **Data Objects** need to call different API endpoints to update their own data and the data of an entire building need to be updated, a way to implement this is by creating a generic update function that is inherited by all **Data Objects** classes, and override it with a specific implementation in these **Data Object** classes. In addition, create another propagating function that not only updates the **Data Object** itself but its direct children, which then update their children... Eventually, the entire subtree including the starting node would update itself entirely. By calling an update function on a BuildingDataObject, all of the FloorDataObjects and RoomDataObjects would be consequently updated from their own data source. Note that an update data function is only an example. Various other interesting functions could be implemented such as a delete function that truncates the whole subtree. [The implementation of this example.](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/PropagateSample.ts)

2. **Retrival**: The member functions of tree nodes can be used to gather information from its descendants. For example, if a BuildingDataObject calls getDailyPower(), this function would automatically and recursively get all the DailyPower value from its children, FloorDataObject, and average them; each FloorDataObject would then do the same thing to its children, RoomDataObject(s), which in this case are the leaf nodes so we will stop here. Each floor's DailyPower is calculated from their rooms' DailyPower and each building's DailyPower is calculated from the resulted DailyPower of their floors' DailyPower. [The implementation of this example.](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/RetrivalSample.ts)

3. **Implicit Optimization**: With the power of propagation in a tree, implementing a **Data Object** member function that implicitly uses optimization algorithms can abstract away some of the complexity in our program. For example, if the goal is to maximize the number of  meetings scheduled in a building or on a floor, the scheduler can greedily pick the room, with the least number of seats, that can hold all the meeting attendees. This [greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm) maximizes the number of meetings scheduled with two conditions: 1. meetings are scheduled in a First-in-First-out order and 2. the starting and ending time of a meeting are unknown. When a BuildingDataObject calls this function to schedule a meeting, it would implicitly use the greedy algorithm to optimally schedule a meeting in a building, while FloorDataObject would instead optimally schedule a meeting on a floor. [The implementation of this example.](https://github.com/zachzhu2016/construction-tree-design-pattern/blob/master/OptimizationSample.ts)
