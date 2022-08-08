#include<iostream>
#include<cstdlib>
using namespace std;

int mian(){
double x,y,min,max,z;
cin>>x>>y;
if(x>y){
    max=x
    min=y;
}
else{
    max=y;
    min=x;
}
z=(min+0.5)/(1+(max*max));
cout<<z;

    return 0;
}