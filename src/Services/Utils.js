import moment from "moment";

export function isNullOrEmpty(str) {
  return str === null || str === undefined || str.trim() === '';
}

export function dmyToYmd(dateStr){
    if(dateStr){
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`; // "2025-05-26"
    }
}

// 
export function getEndingDateByPlanId(membershipStart,planId,duration){
    if (membershipStart && planId) {
      const addMonths = duration; // Do here dynamication as per plan
      const start = new Date(membershipStart);
      const laterDate = new Date(
        start.setMonth(start.getMonth() + Number(addMonths))
      );
      return laterDate.toISOString().split("T")[0];
    }
}

// 
export function getDateInLongFormat(){
  const date = new Date();
  const formattedDate=date.toLocaleDateString("en-US",{
      year:"numeric",
      month:"long",
      day:"numeric"
});
return formattedDate;
}

export function dmyToLongForm(date){
  var formattedDate = date;
  if(date){
    formattedDate = moment(date,"DD-MM-YYYY").format("DD MMM, YYYY");
  }
  return formattedDate;
}