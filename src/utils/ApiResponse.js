class ApiResponse{
   message;
   statusCode;
   data;
   success

  constructor(
    statusCode,
    message="success",
    data,
    success
    

  ){
    this.message=message
    this.statusCode=statusCode
    this.data=data||""
    this.success=success
  }
}

export {ApiResponse}

/*
{
&lookup:{

}
}
*/

// {
//   &lookup:{
//     from:"videos",
//     localfield:"_id",
//     foriegnField:"video_id",
//     as:"watchHistory"
//   }
// }


