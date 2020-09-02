using Common.Base;
using Common.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Entity.Base
{
    public class ResponseBase<T> 
    {
        public List<ResponseMessage> Messages { get; set; }
        public T Data { get; set; }
        public ResponseStatus Status { get; set; }
        public int Count { get; set; }

        public ResponseBase(T data, List<ResponseMessage> messages, int count = 0)
        {
            Data = data;
            Status = messages.Any() ? ResponseStatus.Error : ResponseStatus.Success;
            Messages = messages;
            Count = count;
        }
        public ResponseBase() { }
        public static ResponseBase<T> ReturnResponse(T data, ResponseStatus status, List<ResponseMessage> messages = null)
        {
            return new ResponseBase<T>()
            {
                Messages = messages,
                Data = data,
                Status = status
            };
        }

        public static ResponseBase<T> Error(List<ResponseMessage> messages)
        {
            return new ResponseBase<T>()
            {
                Messages = messages,
                Status = ResponseStatus.Error
            };
        }

        public static ResponseBase<T> Error(string message)
        {
            return new ResponseBase<T>()
            {
                Messages = new List<ResponseMessage>() { new ResponseMessage(message) },
                Status = ResponseStatus.Error
            };
        }

        public static ResponseBase<T> Success(T data, List<ResponseMessage> messages)
        {
            return new ResponseBase<T>()
            {
                Data = data,
                Messages = messages,
                Status = ResponseStatus.Success
            };
        }
    }
    public class ResponseMessage
    {
        public string Value { get; set; }
        public string Code { get; set; }

        public ResponseMessage(string code = null)
        {
            Code = code;
        }
    }
    public enum ResponseStatus
    {
        Success, Error, PasswordExpired
    }
}
