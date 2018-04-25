# hapi-generator
Generator for HAPI based projects

Install: 

```javascript
npm install -g hapi-gen
```

Use:
```javascript
> hapi-gen
// or 
> hapigen
// or 
> hgen
// follow the prompts 
```

The application as the name suggests, generates [hapi.js framework](https://hapijs.com) based:

- micro-services, 
- service plugin
- web application (isomorphic)
- web widget (essentially plugin)

skeletons. 


##### Supported databases: 
- mongodb,
- mysql,
- elasticsearch

##### Supported view-engines: 
- dust



##### Application creation: 
Choose either __service-app__ or __web-app__. After among others providing a name, the generator will create a folder from the name, where the generator ran from. Additional plugins or widgets can be generated from running inside the application folder.  


##### Plugin / Widget creation: 
Choose either __service-plugin__ or __web-app-widget__. After providing a name the generator will create the component inside the plugins (services) or the widgets (web-app) folder.

