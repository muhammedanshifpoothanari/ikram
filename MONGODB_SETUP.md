# MongoDB Setup Instructions

This bill generator uses MongoDB to store all invoices permanently in the cloud.

## Quick Setup (Recommended)

### Option 1: MongoDB Atlas (Free Cloud Database)

1. **Create a free MongoDB Atlas account**
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - Sign up for a free account

2. **Create a free cluster**
   - Click "Build a Database"
   - Select the FREE tier (M0)
   - Choose a cloud provider and region close to you
   - Click "Create Cluster"

3. **Set up database access**
   - Click "Database Access" in the left menu
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Give the user "Read and write to any database" permissions

4. **Set up network access**
   - Click "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your specific IP)
   - Click "Confirm"

5. **Get your connection string**
   - Click "Database" in the left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `billGenerator`

6. **Add to your project**
   - Create a file named `.env.local` in your project root
   - Add this line: `MONGODB_URI=your_connection_string_here`
   - Replace with your actual connection string

### Option 2: Local MongoDB (Advanced)

If you have MongoDB installed locally:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/billGenerator
\`\`\`

## Vercel Deployment

When deploying to Vercel:

1. Go to your project settings on Vercel
2. Click "Environment Variables"
3. Add `MONGODB_URI` with your connection string
4. Save and redeploy

## Troubleshooting

- **Connection Error**: Check your connection string format
- **Authentication Failed**: Verify your username and password
- **Timeout Error**: Check your Network Access settings in MongoDB Atlas
- **Database Not Found**: The database will be created automatically when you save your first bill

## Support

If you need help setting up MongoDB, contact your technical support or visit MongoDB documentation at [https://docs.mongodb.com](https://docs.mongodb.com)
