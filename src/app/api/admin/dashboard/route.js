import { unstable_cache } from 'react';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const getDashboardSummary = unstable_cache(async () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalRecipes,
    pendingRecipes,
    approvedRecipes,
    rejectedRecipes,
    usersByRole,
    recipeStatusCounts,
    categoryCounts,
    monthlyApprovedRows,
    pendingRecipeRows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: 'pending' } }),
    prisma.recipe.count({ where: { status: 'approve' } }),
    prisma.recipe.count({ where: { status: 'reject' } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true },
    }),
    prisma.recipe.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.recipe.groupBy({
      by: ['category_id'],
      _count: { _all: true },
    }),
    prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', created_at) AS month,
        COUNT(*)::int AS count
      FROM recipes
      WHERE status = 'approve'
        AND created_at >= ${sixMonthsAgo}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.recipe.findMany({
      where: { status: 'pending' },
      select: {
        id: true,
        name: true,
        status: true,
        image_url: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const categoryIds = categoryCounts
    .map((item) => item.category_id)
    .filter(Boolean);

  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
      })
    : [];

  const categoryNameMap = new Map(categories.map((category) => [category.id, category.name]));

  const monthlyMap = new Map();
  monthlyApprovedRows.forEach((row) => {
    const monthKey = new Date(row.month).toISOString().slice(0, 7);
    monthlyMap.set(monthKey, Number(row.count));
  });

  const labels = [];
  const data = [];

  for (let index = 5; index >= 0; index -= 1) {
    const month = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const monthKey = month.toISOString().slice(0, 7);
    labels.push(month.toLocaleString('en-US', { month: 'short' }));
    data.push(monthlyMap.get(monthKey) ?? 0);
  }

  return {
    totalUsers,
    totalRecipes,
    pendingRecipes,
    approvedRecipes,
    rejectedRecipes,
    usersByRole: usersByRole.map((item) => ({
      role: item.role,
      count: item._count._all,
    })),
    recipeStatusCounts: recipeStatusCounts.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),
    recipesByCategory: categoryCounts.map((item) => ({
      name: categoryNameMap.get(item.category_id) ?? 'Unknown',
      count: item._count._all,
    })),
    monthlyApprovedRecipeCounts: {
      labels,
      data,
    },
    pendingRecipesList: pendingRecipeRows,
  };
}, ['admin-dashboard-summary'], { revalidate: 30 });

export async function GET() {
  const summary = await getDashboardSummary();
  return NextResponse.json(summary);
}
