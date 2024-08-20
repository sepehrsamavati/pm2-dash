import Services from "../Services";

(async () => {
    console.info("Initializing services...");
    const services = new Services();
    
    console.info("\nInitializing database...");
    await services.databaseConnection.instance.sync();

    console.info("\nCreating admin user...");
    console.info(
        (
            await services.applications.userApplication.createAdmin()
        ).message
    );
})();
