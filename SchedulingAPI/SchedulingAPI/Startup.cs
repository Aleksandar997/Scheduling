using CodebookManagement;
using Common.Base;
using CompanyManagement;
using Configuration.Extensions;
using Configuration.Services;
using Entity;
using ExpressionContext;
using FileManagement;
using Localization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using SchedulingAPI.Hubs;
using Security.Extensions;
using SQLContext;
using System;
using System.IO;
using UserManagement;
using Web.Security.TokenProvider.Implementation;

namespace SchedulingAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDependencies();

            services.AddLocalizationDependencies();
            services.AddConfigurationDependencies();
            services.AddCompanyManagementDependencies();
            services.AddCodebookDependencies();
            services.AddExpressionContextDependencies();
            services.AddUserManagementDependencies();
            services.AddSQLContextDependencies();
            services.AddApiAuthentication();
            services.AddFileManagementDependencies();
            services.AddCors(options =>
                options.AddPolicy("AllowAll", builder =>
                    builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       //.AllowCredentials()
                )
            );
            services.AddSignalR();
            //services.AddCors();
            //services.AddSpaStaticFiles(config => { config.RootPath = "wwwroot"; });
            services.Configure<FormOptions>(options =>
            {
                options.MemoryBufferThreshold = Int32.MaxValue;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            DependencyInjectionResolver.Initialization(app.ApplicationServices);
            Configuration.Bind(AppSettings.Instance);
            if (!string.IsNullOrEmpty(AppSettings.Instance.Config))
                Configuration.LoadDatabaseConfiguration(app.ApplicationServices.GetService<IConfigurationService>());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, @"upload/temp")),
                RequestPath = new PathString("/upload/temp")
            });

            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.UseJWTTokenProviderMiddleware();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SignalHub>("signal");
            });



            //app.UseCors(builder =>
            //        builder.WithOrigins("http://localhost:4200")
            //           .AllowAnyMethod()
            //           .AllowAnyHeader()
            //           .AllowCredentials());



            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //    endpoints.MapHub<SignalHub>("signal");
            //});
        }
    }
}
