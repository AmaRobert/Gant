import {rawInputData} from "./data";
console.clear();
console.log("-------------------------------------------------------------------------------------------------------------------------------------------")
type rawInput = {
    from: string;
    date: string;
    to: string[];
}

type peerInput = {
  from: string,
  date: Date,
  to: string[]
}

type names = {
  name: string,
  dates: Date[]
}

class GanttDiagram{
    private rawData: rawInput[];
    private peerData: peerInput[] = [];
    private names: names[] = [];

    constructor(rawInput: rawInput[]){
        this.rawData = rawInput;
    }

    public transformData(){
        this.rawData.forEach( item => {
            if(item.date != null){
                this.peerData.push({
                    from: item.from,
                    date: new Date(item.date),
                    to: item.to
                })
            }
        }
        )
    }

    public sortDataByDate(){
        this.peerData = this.peerData.sort((b, a) => b.date.getTime() - a.date.getTime());
    }

    public sortDataByName(){
        this.peerData = this.peerData.sort((a, b) => (a > b ? -1 : 1));
    }

    public getNumberOfDays(): any{
        this.sortDataByDate();
        const firstDate = this.peerData[0].date;
        const lastDate = this.peerData[this.peerData.length - 1].date;
        const numOfDays = this.getDifferenceInDays(firstDate, lastDate);
        console.log("Number of days: " + numOfDays);
        return numOfDays;
    }

    public getDifferenceInDays(date1: Date, date2: Date) : any{
        const diffInMs = date2.getTime() - date1.getTime();
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

    public prettyPrint(matrix: any){
        for(var i=0; i<matrix.length; i++){
            let line="";
            for(var j=0; j<matrix[0].length; j++){
                if(matrix[i][j] == undefined){
                    matrix[i][j] = "-";
                }
                line += matrix[i][j];
            }
            console.log(this.names[i].name.padEnd(20) + ' ' + line);
            line="";
        }
    }

    public findAllNames(){
    this.peerData.forEach(element => {
        var index = this.findLast(element.from);
        if(index != -1){
            this.names[index].dates.push(element.date);
        }else{
            this.names.push({name: element.from, dates: [element.date]});
        }
        if(element.to.length){
            element.to.forEach( anotherOne => {
                if(anotherOne != null)
                {var index = this.findLast(anotherOne);
                if(index != -1){
                    this.names[index].dates.push(element.date);
                }else{
                    this.names.push({name: anotherOne, dates: [element.date]});
                }}
            });
        }
        
    });
    }

    public findLast( name: string) : any{
    for(var i=0; i<this.names.length; i++){
        if(this.names[i].name == name)
            return i;
    }
    return -1;
    }

    public prettyMatrix(){
        this.transformData();
        this.findAllNames();
        console.log(this.names);
        let numOfDays = this.getNumberOfDays();
        
        let numOfNames = this.names.length;
        const firstDate = this.peerData[0].date;
        var matrix = [] as any;
        
        for(let i=0; i<numOfNames; i++) {
            matrix[i] = [];
            for(var j=0; j<numOfDays; j++) {
                matrix[i][j] = '-';
            }
        }

        

        for(let i=0; i< numOfNames; i++){
            var dates = this.names[i].dates;
            for(let j=0; j< dates.length - 1; j++){
                if(this.getDifferenceInDays(dates[j], dates[j + 1]) <= 1){
                    var column = this.getDifferenceInDays(firstDate, dates[j]);
                    matrix[i][column] = "=";
                    matrix[i][column + 1] = "="; 
                }
            }
        }
        this.prettyPrint(matrix);

    }

}

const obj = new GanttDiagram(rawInputData);
obj.prettyMatrix();
