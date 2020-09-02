using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Common.Attributes
{
    public class AuthorizeDynamic : AuthorizeAttribute
    {
        public Type asdf { get; set; }
        public AuthorizeDynamic(string crudPermission)
        {
        }

    }
}
