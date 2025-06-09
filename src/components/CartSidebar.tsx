import { X, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { redirectToAmazon } from "@/lib/affiliateLinks";

export function CartSidebar() {
  const { 
    cartItems, 
    cartTotal, 
    cartCount, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  const handleProceedToAmazon = () => {
    if (cartItems.length === 0) return;
    
    // For multiple items, redirect to the first item's Amazon page
    // In a real implementation, you might want to handle this differently
    const firstItem = cartItems[0];
    redirectToAmazon(firstItem.amazonUrl, firstItem.id, firstItem.title, firstItem.price);
    closeCart();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-96 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart ({cartCount})
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="w-4 h-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <Button onClick={closeCart} className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.price}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <>
              <Separator />
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <Button 
                  onClick={handleProceedToAmazon}
                  className="w-full bg-primary hover:bg-orange-600 text-white"
                >
                  Continue to Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  You'll be redirected to Amazon to complete your purchase
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
