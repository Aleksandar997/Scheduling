using Common.Base;
using Configuration.Extensions;
using Configuration.Services;
using Entity;
using Localization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Security.Extensions;
using SQLContext;
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
            services.AddUserManagementDependencies();
            services.AddSQLContextDependencies();
            services.AddApiAuthentication();

            services.AddCors(options =>
                options.AddPolicy("AllowAll", builder =>
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                )
            );
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

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors("AllowAll");

            app.UseAuthorization();
            app.UseJWTTokenProviderMiddleware();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
