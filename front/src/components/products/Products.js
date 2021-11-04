import React,{useState,useEffect} from 'react'
import {CircularProgress, Container,Grid,makeStyles, 
       Paper,Slider,Typography,TextField,FormControl, 
       RadioGroup, FormControlLabel,Radio,Button} from '@material-ui/core'
import axios from 'axios'
import ProductCart from '../productCart/ProductCart';
import {useHistory,useLocation} from 'react-router-dom'  
//(useHistory)when we refresh we should keep the filter state
 //useLocation has access to search params ex location.search to get ==> '?price[gte]=25&price[lte]=340' 
//valueLabelDisplay='auto' ==> when we hover we can see the value 

const useStyles=makeStyles({
    root:{marginTop:20,},
    loader:{width:'100%',display:'flex',justifyContent:'center',alignContent:'center'},
    paper:{marginBottom:'1rem',padding:'13px',},
    filters:{padding:'0 1.5rem'},
    priceRangeInputs:{display:'flex',justifyContent:'space-between'}
  });



function Products() {
const [products,setProducts]=useState([]);
const [loading,setLoading]=useState(false);
const [sliderMax,setSliderMax]=useState(1200);
const [priceRange,setPriceRange]=useState([25,1000])
const [filter,setFilter]=useState('')
const [priceOrder,setPriceOrder]=useState('descending');
const [sorting ,setSorting]=useState('');

const classes=useStyles();
const history=useHistory();
const location=useLocation();
const params=location.search? location.search : null ;


const updateUiValues=(uiValues)=>{
    setSliderMax(uiValues.maxPrice);

    if(uiValues.filtering.price){
        let priceFilter=uiValues.filtering.price;
        setPriceRange([Number(priceFilter.gte),Number(priceFilter.lte)])
    }
    if(uiValues.sorting.price){
        let priceSort=uiValues.sorting.price;
       setPriceOrder(priceSort)
    }
   
}

useEffect(()=>{
    let cancel;
    setLoading(true);
    const fetchData= async()=>{
    try{
         let query;
         if(params && !filter){
            query=params;
           }else{
            query=filter;
          }

          if(sorting){
            if(query.length===0){
                query=`?sort=${sorting}`
            } else{
                query=query+'&sort='+sorting;
            }
          }
        


           const {data}=await axios({
           method:'Get',
           url:`http://localhost:3001/api/v1/products${query}`,   //http://localhost:3001/api/v1/products
           cancelToken:new axios.CancelToken((c)=>cancel=c) // when the user refresh the page twice
                                             // will cancel the first one.
       })
          setProducts(data.data);
          console.log(data)
          setLoading(false);
           updateUiValues(data.uiValues);
       }catch(error){
           if(axios.isCancel(error)) return;
          console.log(error.response.data)
       }
  }
   fetchData();
   return ()=>cancel();
},[filter,params,sorting])

const HandlePriceInputs=(e,type)=>{
let newRange;
   if(type==='lower')
    {
      newRange={...priceRange};
      newRange[0]=Number(e.target.value);
     setPriceRange(newRange);
   }
    if(type==='upper')
    {
     newRange={...priceRange};
     newRange[1]=Number(e.target.value);
     setPriceRange(newRange);
   }
 }

const onSlideCommitHandler=(e,newValue)=>{
  buildRangeFilter(newValue);
}

const onTextfieldCommitHandler=()=>{
    buildRangeFilter(priceRange);
}
 const buildRangeFilter=(newValue)=>{
   const urlFilter=`?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;
   setFilter(urlFilter);
   history.push(urlFilter);
 }

const HandleSortChange=(e)=>{
    setPriceOrder(e.target.value);
    if(e.target.value==='ascending')
    {
      setSorting('price')
    }
    else if(e.target.value==='descending')
    {
      setSorting('-price')
    }
 }

 const clearAllFilters=()=>{
     setFilter('');
     setSorting('');
     setPriceRange([0,sliderMax]);
     history.push('/');
 }
 
    return (
        <Container>

     {/* Filtering and Sorting */}

            <Paper className={classes.paper}>   {/* Box Shadow*/}
             <Grid container>
               <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Filters</Typography>
                      <div className={classes.filters}>
                          <Slider min={0} max={sliderMax} value={priceRange} 
                            valueLabelDisplay='auto'  
                            disabled={loading}
                            onChange={(e,newValue)=>setPriceRange(newValue)}
                            onChangeCommitted={onSlideCommitHandler}
                          /> 
                      </div>
                       <div className={classes.priceRangeInputs}>
                           <TextField size='small' variant='outlined' 
                               label='Mini-price' id='lower'
                               type='number' disabled={loading} 
                               value={priceRange[0]} onChange={(e)=>HandlePriceInputs(e,'lower')}
                               onBlur={onTextfieldCommitHandler}
                                />

                           <TextField size='small' variant='outlined' 
                               label='Max-price' id='upper'
                               type='number' disabled={loading}
                               value={priceRange[1]}  onChange={(e)=>HandlePriceInputs(e,'upper')}
                               onBlur={onTextfieldCommitHandler}
                                />
                       </div>
               </Grid>
             <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Sort By</Typography>
               <FormControl component='fieldset' className={classes.filters}>
                <RadioGroup area-label='price-order' name='price-order' value={priceOrder} onChange={HandleSortChange}>
                  <FormControlLabel disabled={loading} control={<Radio />} 
                    label='Price :Highest - Lowest' value='descending' />
                  <FormControlLabel disabled={loading} control={<Radio />}
                   label='Price :Lowest - Highest' value='ascending' />
                 </RadioGroup>
               </FormControl>
              </Grid>
              </Grid>
              <Button size='small' color='primary' onClick={clearAllFilters}>Clear All</Button>
            </Paper>

           <Grid   container spacing={2}  className={classes.root}>
           {loading ? (<div className={classes.loader}>
               <CircularProgress  size='3rem' thickness={5} />
           </div>
           ):(
               products.map(product =>{
                   return(
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCart product={product} />
                    </Grid>
                    ) 
               })
           )}
           
           </Grid>
        </Container>
    )
}

export default Products
