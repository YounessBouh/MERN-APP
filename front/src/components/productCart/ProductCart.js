import React from 'react'
import { Card, CardContent, CardHeader, Typography,CardActions,Button} from '@material-ui/core'
import  Rating  from '@material-ui/lab/Rating'
import Image from 'material-ui-image'



function ProductCart({product}) {
    return (
        <Card>
            <CardHeader
             title={<Typography variant='h6' >{product.name}</Typography>}
            />

            <CardContent>
            <Image src={product.imageURL} />
            <Typography >$ {product.price}</Typography>
            <Rating 
               value={product.rating}  readOnly name={product.name} 
               size='small'  precision={0.5}   />
            </CardContent>
            
            <CardActions>
            <Button variant='contained' size='small' color='primary'  >Product New</Button>
            <Button  size='small' color='primary'  >Learn more</Button>
            </CardActions>
        </Card>
    )
}

export default ProductCart
